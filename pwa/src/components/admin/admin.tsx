"use client";

import { useState, useEffect } from "react";
import { Resource, Loading, AuthProvider } from "react-admin";
import { useSession } from "next-auth/react";
import { ApiPlatformAdminDataProvider, HydraAdmin } from "@api-platform/admin";
import PeopleIcon from "@mui/icons-material/People";

import { createHydraDataProvider } from "./data-provider";
import { createAuthProvider } from "./auth-provider";
import { Dashboard } from "./dashboard";
import LoginPage from "@/app/(auth)/login/page";
import { ENTRYPOINT } from "@/config/entrypoint";
import { UserCreate, UserEdit, UserList, UserShow } from "./users";

export default function Admin() {
  const { data: session, status } = useSession();
  const [dataProvider, setDataProvider] =
    useState<ApiPlatformAdminDataProvider>();
  const [authProvider, setAuthProvider] = useState<AuthProvider>();

  useEffect(() => {
    // Only set up providers when session is available and valid
    if (status === "authenticated" && session?.accessToken && !session?.error) {
      const initializeProviders = async () => {
        try {
          const dataProviderInstance = await createHydraDataProvider(
            `${ENTRYPOINT}`,
            session.accessToken || ""
          );
          setDataProvider(dataProviderInstance);

          const authProviderInstance = createAuthProvider(session);
          setAuthProvider(() => authProviderInstance);
        } catch (error) {
          console.error("Failed to initialize providers:", error);
        }
      };

      initializeProviders();
    }
  }, [status, session]);

  // If session has error, don't render the admin interface
  if (session?.error === "RefreshTokenError") {
    return (
      <Loading loadingPrimary="loading..." loadingSecondary="session erroor" />
    );
  }

  // Show loading while session is loading or providers are being initialized
  if (status === "loading" || !dataProvider || !authProvider) {
    return (
      <Loading loadingPrimary="loading..." loadingSecondary="initializing" />
    );
  }

  // If not authenticated, the middleware will redirect, but we'll handle it here too
  if (status === "unauthenticated") {
    return (
      <Loading
        loadingPrimary="loading..."
        loadingSecondary="Not Authenticated"
      />
    );
  }

  return (
    <HydraAdmin
      entrypoint={`${ENTRYPOINT}`}
      dataProvider={dataProvider}
      authProvider={authProvider}
      loginPage={LoginPage}
      dashboard={() => <Dashboard />}
    >
      {/* Add more resources as needed */}
      <Resource
        name="api/users"
        options={{ label: "Users" }}
        list={UserList}
        show={UserShow}
        edit={UserEdit}
        create={UserCreate}
        icon={PeopleIcon}
      />
    </HydraAdmin>
  );
}
