import { OrdreFabricationsTable } from "@/components/ordre-fabrications/ordre-fabrications-table";

export default function OrdreFabricationsPage() {
  return (
    <div className="container mx-auto py-4 sm:py-8 px-0 sm:px-4">
      <div className="mb-6 sm:mb-8 px-4 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Gestion des ordres de fabrication
        </h1>
      </div>
      <OrdreFabricationsTable />
    </div>
  );
}
