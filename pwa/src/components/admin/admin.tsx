"use client";

import { useState, useEffect } from "react";
import {
  Resource,
  Loading,
  AuthProvider,
} from "react-admin";
import { signOut, useSession } from "next-auth/react";
import { ApiPlatformAdminDataProvider, HydraAdmin } from "@api-platform/admin";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";

import { createHydraDataProvider } from "./data-provider";
import { createAuthProvider } from "./auth-provider";
import { Dashboard } from "./dashboard";
import LoginPage from "@/app/(auth)/login/page";
import { UserCreate, UserEdit, UserList, UserShow } from "./users";
import { ClientList, ClientShow, ClientCreate, ClientEdit } from "./clients";
import {
  AccessTime,
  AssignmentInd,
  Badge,
  Checkroom,
  DateRange,
  Hardware,
  Inventory,
  MapsHomeWork,
} from "@mui/icons-material";
import { ArticleList, ArticleShow } from "./articles";
import {
  OrdreFabricationList,
  OrdreFabricationShow,
} from "./ordres-fabrication";
import { IlotCreate, IlotEdit, IlotList, IlotShow } from "./ilots";
import {
  EmployeCreate,
  EmployeEdit,
  EmployeList,
  EmployeShow,
} from "./employes";
import { PlanningList, PlanningShow } from "./plannings";
import { ProductionList, ProductionShow } from "./productions";
import { PresenceList, PresenceShow } from "./presences";
import {
  MachineCreate,
  MachineEdit,
  MachineList,
  MachineShow,
} from "./machines";
import PlanningCreate from "./plannings/PlanningCreate";
import PlanningEdit from "./plannings/PlanningEdit";
import { ENTRYPOINT } from "@/config/api";
import {
  AffectationEmployeIlotCreate,
  AffectationEmployeIlotEdit,
  AffectationEmployeIlotList,
  AffectationEmployeIlotShow,
} from "./affectation-employe-ilot";
import { darkTheme, lightTheme } from "./themes";
import CustomLayout from "./layout/CustomLayout";

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

  // If session has error, don't render the admin interface, just signout
  if (session?.error === "RefreshTokenError") {
    signOut({ callbackUrl: "/login" });
    return (
      <Loading loadingPrimary="Signing out..." loadingSecondary="Please wait" />
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
      theme={lightTheme}
      lightTheme={lightTheme}
      darkTheme={darkTheme}
      layout={CustomLayout}
    >
      {/* Add more resources as needed */}
      <Resource
        name="api/users"
        options={{ label: "Utilisateurs" }}
        list={UserList}
        show={UserShow}
        edit={UserEdit}
        create={UserCreate}
        icon={PeopleIcon}
      />

      <Resource
        name="api/ilots"
        options={{ label: "Ilots" }}
        list={IlotList}
        show={IlotShow}
        create={IlotCreate}
        edit={IlotEdit}
        icon={MapsHomeWork}
      />

      <Resource
        name="api/machines"
        options={{ label: "Machines" }}
        list={MachineList}
        show={MachineShow}
        create={MachineCreate}
        edit={MachineEdit}
        icon={Hardware}
      />

      <Resource
        name="api/employes"
        options={{ label: "Employes" }}
        list={EmployeList}
        show={EmployeShow}
        create={EmployeCreate}
        edit={EmployeEdit}
        icon={Badge}
      />

      <Resource
        name="api/affectation_employe_ilots"
        options={{ label: "Affectation Emp Ilot" }}
        list={AffectationEmployeIlotList}
        show={AffectationEmployeIlotShow}
        create={AffectationEmployeIlotCreate}
        edit={AffectationEmployeIlotEdit}
        icon={TransferWithinAStationIcon}
      />

      <Resource
        name="api/clients"
        options={{ label: "Clients" }}
        list={ClientList}
        show={ClientShow}
        create={ClientCreate}
        edit={ClientEdit}
        icon={WorkIcon}
      />

      <Resource
        name="api/articles"
        options={{ label: "Articles" }}
        list={ArticleList}
        show={ArticleShow}
        icon={Checkroom}
      />

      <Resource
        name="api/ordre_fabrications"
        list={OrdreFabricationList}
        show={OrdreFabricationShow}
        icon={AssignmentInd}
        options={{ label: "Ordres de Fabrication" }}
      />

      <Resource
        name="api/plannings"
        list={PlanningList}
        show={PlanningShow}
        create={PlanningCreate}
        edit={PlanningEdit}
        icon={DateRange}
        options={{ label: "Plannings" }}
      />

      <Resource
        name="api/productions"
        list={ProductionList}
        show={ProductionShow}
        icon={Inventory}
        options={{ label: "Productions" }}
      />

      <Resource
        name="api/presences"
        list={PresenceList}
        show={PresenceShow}
        icon={AccessTime}
        options={{ label: "Présences" }}
      />
    </HydraAdmin>
  );
}
