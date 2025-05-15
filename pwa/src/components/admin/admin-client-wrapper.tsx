"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { Loading } from "react-admin";

// Dynamically import Admin with no SSR
const Admin = dynamic(() => import("./admin"), {
  ssr: false,
  loading: () => (
    <Loading loadingPrimary="loading..." loadingSecondary="dynamic import" />
  ),
});

export default function AdminClientWrapper() {
  const { status } = useSession();
  const [isClient, setIsClient] = useState(false);

  // This ensures we only render the admin component on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Loading
        loadingPrimary="loading..."
        loadingSecondary="client component"
      />
    );
  }

  if (status === "loading") {
    return <Loading loadingPrimary="loading..." loadingSecondary="wrapping" />;
  }

  return <Admin />;
}
