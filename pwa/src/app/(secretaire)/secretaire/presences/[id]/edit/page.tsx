import { PresenceForm } from "@/components/presences/presence-form";

interface EditPresencePageProps {
  params: {
    id: string;
  };
}

export default async function EditPresencePage({
  params,
}: EditPresencePageProps) {
  const presenceId = Number.parseInt(params.id);

  return (
    <div className="container">
      <div className="p-2 sm:p-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Modifier la présence</h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Mettez à jour les détails de la présence
        </p>
      </div>
      <PresenceForm presenceId={presenceId} />
    </div>
  );
}
