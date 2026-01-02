import { PresenceDetails } from "@/components/presences/presence-detail";

interface PresenceDetailPageProps {
  params: {
    id: string;
  };
}

export default async function PresenceDetailPage({
  params,
}: PresenceDetailPageProps) {
  const presenceId = Number.parseInt(params.id);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Détails de la présence</h1>
      <PresenceDetails id={presenceId} />
    </div>
  );
}
