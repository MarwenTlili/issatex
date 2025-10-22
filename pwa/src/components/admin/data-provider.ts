import { ENTRYPOINT } from "@/config/api";
import {
  ApiPlatformAdminDataProvider,
  hydraDataProvider,
  HydraHttpClientResponse,
} from "@api-platform/admin";
import { parseHydraDocumentation } from "@api-platform/api-doc-parser";
import { getSession, signOut } from "next-auth/react";
import { fetchUtils, HttpError } from "react-admin";

export const httpClient = async (
  url: string | URL,
  options: any = {}
): Promise<HydraHttpClientResponse> => {
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

  try {
    // Do a *normal fetch*, not fetchHydra,
    // otherwise it will throw HttpError and we can't map fileds errors
    const response = await fetchUtils.fetchJson(
      new URL(url, ENTRYPOINT).toString(),
      {
        ...options,
        headers,
      }
    );

    return {
      status: response.status,
      headers: response.headers,
      json: response.json,
    };
  } catch (error: any) {
    // This is where 4xx/5xx errors end up
    if (error instanceof HttpError) {
      const body = error.body;

      if (error.status === 401 || error.status === 403) {
        await signOut({ redirect: true, callbackUrl: "/login" });
      }

      if (body?.violations) {
        // preserve API Platform's validation error structure
        throw new HttpError(
          body.title || "An error occured",
          error.status,
          body
        );
      }
    }

    throw error;
  }
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
