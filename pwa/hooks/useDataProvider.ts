import {
  hydraDataProvider as baseHydraDataProvider,
  fetchHydra as baseFetchHydra,
} from "@api-platform/admin";
import { ENTRYPOINT } from "@/config/entrypoint";
import { parseHydraDocumentation } from "@api-platform/api-doc-parser";
import { useSession } from "next-auth/react";
import { logger } from "../lib/utils/Logger";

export const useHeaders = () => {
  const { data: session } = useSession();

  return () => {
    const headers = new Headers();
    if (session?.accessToken) {
      headers.set("Authorization", `Bearer ${session.accessToken}`);
    }
    return headers;
  };
};

const fetchHydra =
  (getHeaders: () => Headers) =>
  async (url: URL, options = {}) =>
    baseFetchHydra(url, {
      ...options,
      headers: getHeaders(),
    });

export const apiDocumentationParser =
  (setRedirectToLogin: (arg0: boolean) => void, getHeaders: () => Headers) =>
  async () => {
    try {
      setRedirectToLogin(false);
      return await parseHydraDocumentation(`${ENTRYPOINT}`, {
        headers: getHeaders(),
      });
    } catch (result) {
      // @ts-ignore
      const { api, response, status } = result;
      if (status !== 401 || !response) {
        logger("error", "API Documentation Error:", result);
      }

      setRedirectToLogin(true);

      return { api, response, status };
    }
  };

const useDataProvider = (setRedirectToLogin: (arg0: boolean) => void) => {
  const getHeaders = useHeaders(); // Use the hook here

  const baseDataProvider = baseHydraDataProvider({
    useEmbedded: false,
    entrypoint: `${ENTRYPOINT}`,
    httpClient: fetchHydra(getHeaders),
    apiDocumentationParser: apiDocumentationParser(
      setRedirectToLogin,
      getHeaders
    ),
  });

  return baseDataProvider;
};

export default useDataProvider;
