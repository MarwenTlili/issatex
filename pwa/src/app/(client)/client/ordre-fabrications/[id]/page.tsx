import { OrdreFabricationDetails } from "@/components/ordre-fabrications/ordre-fabrication-details";

interface OrdreFabricationPageProps {
  params: {
    id: string;
  };
}

export default function OrdreFabricationPage({
  params,
}: OrdreFabricationPageProps) {
  const id = Number.parseInt(params.id, 10);

  return (
    <div className="container mx-auto py-4 sm:py-8 px-0 sm:px-4">
      <div className="mb-6 sm:mb-8 px-4 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Details de l&apos;ordre de fabrication
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Voir les informations détaillées sur cet ordre de fabrication
        </p>
      </div>
      <OrdreFabricationDetails id={id} />
    </div>
  );
}
