import { ENTRYPOINT } from "@/config/entrypoint";
import {
  ApiPlatformAdminDataProvider,
  fetchHydra,
  HttpClientResponse,
  hydraDataProvider,
} from "@api-platform/admin";
import { parseHydraDocumentation } from "@api-platform/api-doc-parser";
import { getSession, signOut } from "next-auth/react";

export const httpClient = async (
  url: string | URL,
  options: any = {}
): Promise<HttpClientResponse> => {
  const session = await getSession();

  if (session?.error === "RefreshTokenError") {
    // Immediately sign out (defensive fallback)
    await signOut({ redirect: true, callbackUrl: "/login" });
    throw new Error("Session expired");
  }

  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/ld+json");

  if (session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }

  const response = await fetchHydra(new URL(url, ENTRYPOINT), {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    await signOut({ redirect: true, callbackUrl: "/login" });
    throw new Error("Unauthorized");
  }

  return response;
};

export const createHydraDataProvider = async (
  entrypoint: string,
  token: string
): Promise<ApiPlatformAdminDataProvider> => {
  const headers = new Headers({ Accept: "application/ld+json" });

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Create and return the data provider
  return hydraDataProvider({
    entrypoint,
    httpClient,
    apiDocumentationParser: () =>
      parseHydraDocumentation(`${ENTRYPOINT}`, { headers }),
    useEmbedded: true,
  });
};
