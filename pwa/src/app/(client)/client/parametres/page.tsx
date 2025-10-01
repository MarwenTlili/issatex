import type { Metadata } from "next";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { Settings } from "lucide-react";

export const metadata: Metadata = {
  title: "Paramètres - Issatex",
  description: "Gérez vos paramètres de compte",
};

export default function ClientSettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-full bg-primary/10 p-3">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Paramètres</h1>
        </div>
        <p className="text-muted-foreground">
          Gérez vos informations de profil et vos préférences de compte
        </p>
      </div>

      <ProfileSettings />
    </div>
  );
}
