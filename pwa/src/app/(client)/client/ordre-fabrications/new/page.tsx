import { OrdreFabricationForm } from "@/components/ordre-fabrications/ordre-fabrication-form";

export default function NewOrdreFabricationPage() {
  return (
    <div className="container mx-auto py-4 sm:py-8 px-0 sm:px-4">
      <div className="mb-6 sm:mb-8 px-4 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Créer un nouvel ordre de fabrication
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Ajoutez un nouvel ordre de fabrication à votre collection
        </p>
      </div>
      <div className="flex justify-center">
        <OrdreFabricationForm />
      </div>
    </div>
  );
}
