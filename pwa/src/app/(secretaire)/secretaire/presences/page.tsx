import { PresencesTable } from "@/components/presences/presences-table";

export default async function PresencesPage() {
  return (
    <div className="container max-w-full p-2 sm:p-4">
      <PresencesTable />
    </div>
  );
}
