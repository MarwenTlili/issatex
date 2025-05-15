import type { AuthProvider } from "react-admin";
import { signOut } from "next-auth/react";

export const createAuthProvider = (session: any): AuthProvider => ({
  // Login is handled by NextAuth, this method won't be called directly
  login: () => Promise.resolve(),

  // Logout using NextAuth's signOut
  logout: () => {
    signOut({ callbackUrl: "/login" });
    return Promise.resolve();
  },

  // Check if the user is authenticated as ADMIN and session error
  checkAuth: () => {
    if (
      !session ||
      !session.accessToken ||
      !session?.user?.roles?.includes("ROLE_ADMIN")
    ) {
      return Promise.reject();
    }
    return Promise.resolve();
  },

  // Check for error responses that indicate auth issues
  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      return Promise.reject();
    }
    return Promise.resolve();
  },

  // Get the user's identity
  getIdentity: () => {
    if (!session || !session.user) {
      return Promise.reject();
    }

    return Promise.resolve({
      id: session.user.id,
      fullName: session.user.name || "",
      avatar: session.user.image,
    });
  },

  // Get the user's permissions based on their roles
  getPermissions: () => {
    if (!session || !session.user.roles) {
      return Promise.reject();
    }
    return Promise.resolve(session.user.roles);
  },
});
