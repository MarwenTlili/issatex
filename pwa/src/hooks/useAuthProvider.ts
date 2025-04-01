import { signIn, signOut, useSession } from "next-auth/react";
import { AuthProvider } from "react-admin";

export const useAuthProvider = (): AuthProvider => {
  const { data: session } = useSession();

  return {
    login: async ({ username, password }) => {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        throw new Error("Invalid credentials");
      }

      return Promise.resolve();
    },

    logout: async () => {
      await signOut({ redirect: false });
      return Promise.resolve();
    },

    checkAuth: async () => {
      if (!session || !session.user.roles?.includes("ROLE_ADMIN")) {
        return Promise.reject({ redirectTo: "/login" });
      }
      return Promise.resolve();
    },

    checkError: async (error) => {
      if (error?.status === 401 || error?.status === 403) {
        await signOut({ redirect: false }); // Log out user on authentication failure
        return Promise.reject({ redirectTo: "/login" });
      }
      return Promise.resolve();
    },

    getIdentity: async () => {
      if (!session?.user) return Promise.reject();
      return Promise.resolve({
        id: session.user.id,
        fullName: session.user.name,
        avatar: session.user.image,
      });
    },

    getPermissions: async () => {
      if (!session?.user.roles) return Promise.reject();
      return Promise.resolve(session.user.roles);
    },
  };
};
