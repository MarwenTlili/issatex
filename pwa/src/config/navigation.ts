import {
  CalendarClock,
  FactoryIcon,
  Home,
  Layers,
  Shirt,
  Settings,
} from "lucide-react";
import { APP_ROUTES } from "./app";

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
  order: number;
}

export const navigationConfig: NavItem[] = [
  // Common routes
  {
    name: "Accueil",
    href: "/",
    icon: Home,
    roles: [],
    order: 1,
  },
  // Client-specific routes
  {
    name: "Articles",
    href: "/client/articles",
    icon: Shirt,
    roles: ["ROLE_CLIENT"],
    order: 10,
  },
  {
    name: "Ordres de fabrication",
    href: "/client/ordre-fabrications",
    icon: Layers,
    roles: ["ROLE_CLIENT"],
    order: 11,
  },
  // Secretary-specific routes
  {
    name: "Productions",
    href: "/secretaire/productions",
    icon: FactoryIcon,
    roles: ["ROLE_SECRETARY"],
    order: 20,
  },
  {
    name: "Présences",
    href: "/secretaire/presences",
    icon: CalendarClock,
    roles: ["ROLE_SECRETARY"],
    order: 21,
  },
];

// Fiter navigation items
export const getNavigationItems = (userRoles: string[] = []): NavItem[] => {
  return navigationConfig
    .filter((item) => {
      if (item.roles.length === 0) return true;
      return item.roles.some((role) => userRoles.includes(role));
    })
    .sort((a, b) => a.order - b.order);
};

// Check route access
export const hasRouteAccess = (route: string, userRoles: string[]): boolean => {
  const navItem = navigationConfig.find((item) => item.href === route);
  if (!navItem) return false;

  if (navItem.roles.length === 0) return true;
  return navItem.roles.some((role) => userRoles.includes(role));
};

// Get items by specific role
export const getItemsByRole = (role: string): NavItem[] => {
  return navigationConfig.filter(
    (item) => item.roles.includes(role) || item.roles.length === 0
  );
};

export interface ProfileMenuItem {
  name: string;
  href: string; // link if navigable
  action?: () => void; // optional callback for buttons (like signOut)
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
  order: number;
}

export const profileMenuConfig: ProfileMenuItem[] = [
  {
    name: "Paramètres",
    href: APP_ROUTES.CLIENT.SETTINGS,
    icon: Settings,
    roles: ["ROLE_CLIENT"],
    order: 1,
  },
  {
    name: "Paramètres",
    href: APP_ROUTES.SECRETAIRE.SETTINGS,
    icon: Settings,
    roles: ["ROLE_SECRETARY"],
    order: 1,
  },
];

export const getProfileMenuItems = (
  userRoles: string[] = []
): ProfileMenuItem[] => {
  return profileMenuConfig
    .filter((item) => {
      if (item.roles.length === 0) return true;
      return item.roles.some((role) => userRoles.includes(role));
    })
    .sort((a, b) => a.order - b.order);
};
