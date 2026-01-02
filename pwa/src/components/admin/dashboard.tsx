"use client";

import { useGetList } from "react-admin";
import { useSession } from "next-auth/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Dashboard = () => {
  const { data: session } = useSession();

  // Example of using react-admin's data fetching hooks
  const { data: users, isLoading: usersLoading } = useGetList("api/users", {
    pagination: { page: 1, perPage: 10 },
    sort: { field: "id", order: "DESC" },
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <p className="mb-6">Welcome, {session?.user?.name || "Unknown"}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              {usersLoading
                ? "Loading..."
                : `Total users: ${users?.length || 0}`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Role</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{session?.user?.roles?.join(", ") || "No roles assigned"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session Info</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Session expires: </p>
            <p>
              {new Date(session?.expires || "").toLocaleDateString()}
              {", "}
              {new Date(session?.expires || "").toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
