import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TermsOfUseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TermsOfUseModal({ open, onOpenChange }: TermsOfUseModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-w-2xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Conditions d&apos;utilisation</DialogTitle>
          <DialogDescription>
            Dernière mise à jour : Juin 2026
          </DialogDescription>
        </DialogHeader>
        <div
          className="flex-1 min-h-0 pr-4 overflow-y-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} // Firefox and IE
        >
          {/* Safari/Chrome */}
          <style
            dangerouslySetInnerHTML={{
              __html: `div::-webkit-scrollbar { display: none; }`,
            }}
          />
          <div className="space-y-6 text-sm">
            {/* Section 1 */}
            <section>
              <h3 className="font-semibold text-base mb-2">
                1. Acceptation des conditions
              </h3>
              <p className="text-muted-foreground">
                En accédant et en utilisant la plateforme Issatex (ci-après
                dénommée « Service »), vous acceptez d&apos;être lié par ces
                conditions d&apos;utilisation. Si vous n&apos;acceptez pas ces
                conditions, veuillez ne pas utiliser le Service.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h3 className="font-semibold text-base mb-2">
                2. Inscription et compte utilisateur
              </h3>
              <p className="text-muted-foreground mb-2">
                Vous êtes responsable de la confidentialité de vos données
                d&apos;inscription et du mot de passe. Vous acceptez de ne pas
                partager votre compte avec d&apos;autres personnes. Vous devez
                nous informer immédiatement de toute utilisation non autorisée
                de votre compte.
              </p>
              <p className="text-muted-foreground">
                Vous devez fournir des informations exactes et complètes lors de
                votre inscription. Vous acceptez de maintenir ces informations à
                jour.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h3 className="font-semibold text-base mb-2">
                3. Utilisation autorisée
              </h3>
              <p className="text-muted-foreground mb-2">
                Vous acceptez d&apos;utiliser le Service uniquement à des fins
                légales et conformément à toutes les lois applicables.
              </p>
              <p className="text-muted-foreground">Vous acceptez de ne pas :</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                <li>
                  Utiliser le Service pour des activités illégales ou nuisibles
                </li>
                <li>
                  Accéder à ou modifier le Service ou ses systèmes sans
                  autorisation
                </li>
                <li>
                  Télécharger ou transmettre des virus, malwares ou code
                  malveillant
                </li>
                <li>Contourner les mesures de sécurité du Service</li>
                <li>Utiliser le Service pour du harcèlement ou du spam</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h3 className="font-semibold text-base mb-2">
                4. Propriété intellectuelle
              </h3>
              <p className="text-muted-foreground">
                Tous les contenus, fonctionnalités et matériaux du Service,
                incluant les textes, graphiques, logos, images et logiciels,
                sont la propriété d&apos;Issatex ou de ses fournisseurs de
                contenu. Vous acceptez de ne pas reproduire, dupliquer, copier,
                vendre ou exploiter toute partie du Service sans autorisation
                écrite explicite.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h3 className="font-semibold text-base mb-2">
                5. Limitation de responsabilité
              </h3>
              <p className="text-muted-foreground mb-2">
                Le Service est fourni « tel quel » sans aucune garantie,
                expresse ou implicite. Issatex ne garantit pas que le Service
                sera ininterrompu, opportun, sûr ou exempt d&apos;erreurs.
              </p>
              <p className="text-muted-foreground">
                Dans la limite maximale autorisée par la loi, Issatex ne sera
                pas responsable des dommages indirects, spéciaux, accessoires ou
                consécutifs, ni de la perte de profits ou de données, résultant
                de votre utilisation du Service.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h3 className="font-semibold text-base mb-2">
                6. Interruption du Service
              </h3>
              <p className="text-muted-foreground">
                Issatex se réserve le droit de modifier, suspendre ou
                interrompre le Service à tout moment, sans préavis ni
                responsabilité. Nous pouvons également résilier votre compte ou
                votre accès au Service à tout moment, pour quelque raison que ce
                soit, notamment si vous violez ces conditions.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h3 className="font-semibold text-base mb-2">
                7. Modifications des conditions
              </h3>
              <p className="text-muted-foreground">
                Issatex se réserve le droit de modifier ces conditions à tout
                moment. Les modifications seront effectives dès leur publication
                sur le Service. Votre utilisation continue du Service après
                publication des modifications constitue votre acceptation des
                conditions modifiées.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h3 className="font-semibold text-base mb-2">
                8. Contact et loi applicable
              </h3>
              <p className="text-muted-foreground mb-2">
                Ces conditions sont régies par et construites conformément aux
                lois de la juridiction applicable.
              </p>
              <p className="text-muted-foreground">
                Pour toute question concernant ces conditions, veuillez nous
                contacter à l&apos;adresse : support@issatex.com
              </p>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
