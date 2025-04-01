import { useContext, useEffect, useState } from "react";
import { Navigate, Route } from "react-router-dom";
import { HydraAdmin, OpenApiAdmin } from "@api-platform/admin";
import { Layout, LayoutProps, localStorageStore } from "react-admin";
import DocContext from "./DocContext";
import AppBar from "./Layout/AppBar";
import { ENTRYPOINT, OPEN_API_DOC, API_PREFIX } from "@/config/entrypoint";
import i18nProvider from "./i18nProvider";
import LoginPage from "@/app/(main)/login/page";
import { useRouter } from "next/navigation";
import { RingLoader } from "react-spinners";
import { useAuthProvider } from "@/hooks/useAuthProvider";
import useDataProvider from "@/hooks/useDataProvider";
import { useSession } from "next-auth/react";

const store = localStorageStore();

/**
 * Redirect
 */
const RedirectToLogin = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <RingLoader color="#46B6BF" />;
  }

  if (!session) {
    return <Navigate to="/login" />;
  }

  return null;
};

/**
 * Admin Layout
 */
const AdminLayout = (props: JSX.IntrinsicAttributes & LayoutProps) => (
  <Layout {...props} appBar={AppBar} />
);

/**
 * Admin UI Component
 */
const AdminUI = () => {
  const router = useRouter();
  const { docType } = useContext(DocContext);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const authProvider = useAuthProvider(); // Use the hook
  const dataProvider = useDataProvider(setRedirectToLogin); // Use the hook

  useEffect(() => {
    authProvider
      .checkAuth({})
      .then(() => setIsAuthenticated(true))
      .catch(() => router.push("/login"));
  }, []); // Only run once on mount

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        {/* <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div> */}
        <RingLoader color="#46B6BF" />
      </div>
    );
  }

  return docType === "hydra" ? (
    isAuthenticated ? (
      <HydraAdmin
        entrypoint={`${ENTRYPOINT}`}
        dataProvider={dataProvider}
        authProvider={authProvider}
        i18nProvider={i18nProvider}
        layout={AdminLayout}
        loginPage={LoginPage}
      />
    ) : (
      <RedirectToLogin />
    )
  ) : (
    <OpenApiAdmin
      entrypoint={`${ENTRYPOINT}/${API_PREFIX}`}
      docEntrypoint={`${ENTRYPOINT}${OPEN_API_DOC}`}
      dataProvider={dataProvider}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
      layout={AdminLayout}
      loginPage={LoginPage}
    />
  );
};

/**
 * Admin Context
 */
const AdminWithContext = () => {
  const [docType, setDocType] = useState(
    store.getItem<string>("docType", "hydra")
  );

  return (
    <DocContext.Provider
      value={{
        docType,
        setDocType,
      }}
    >
      <AdminUI />
    </DocContext.Provider>
  );
};

/**
 * Admin Component
 */
const Admin = () => <AdminWithContext />;

export default Admin;
