import { OrdreFabricationForm } from "@/components/ordre-fabrications/ordre-fabrication-form";

interface EditOrdreFabricationPageProps {
  params: {
    id: string;
  };
}

export default function EditOrdreFabricationPage({
  params,
}: EditOrdreFabricationPageProps) {
  const id = Number.parseInt(params.id, 10);

  return (
    <div className="container mx-auto py-4 sm:py-8 px-0 sm:px-4">
      <div className="mb-6 sm:mb-8 px-4 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold">
          {"Modifier l'Ordre de fabrication"}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          {"Mettre à jour les détails de votre ordre de fabrication"}
        </p>
      </div>
      <div className="flex justify-center">
        <OrdreFabricationForm ordreFabricationId={id} />
      </div>
    </div>
  );
}
