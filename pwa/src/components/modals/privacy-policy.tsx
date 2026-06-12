"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PrivacyPolicyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrivacyPolicyModal({
  open,
  onOpenChange,
}: PrivacyPolicyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-w-2xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Politique de confidentialité</DialogTitle>
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
              <h3 className="font-semibold text-base mb-2">1. Introduction</h3>
              <p className="text-muted-foreground">
                Chez Issatex, nous accordons une grande importance à la
                protection de vos données personnelles. Cette politique de
                confidentialité explique comment nous collectons, utilisons,
                partageons et protégeons vos informations.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h3 className="font-semibold text-base mb-2">
                2. Données collectées
              </h3>
              <p className="text-muted-foreground mb-2">
                Nous collectons les données suivantes lors de votre inscription
                :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Nom et prénom</li>
                <li>Adresse e-mail</li>
                <li>Numéro de téléphone</li>
                <li>Nom de l&apos;entreprise</li>
                <li>Type d&apos;entreprise</li>
                <li>Taille de l&apos;entreprise</li>
                <li>Secteur textile (catégories)</li>
                <li>Zone géographique de focus marché</li>
                <li>Adresse physique</li>
                <li>Adresse de livraison</li>
                <li>Description de l&apos;entreprise</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h3 className="font-semibold text-base mb-2">
                3. Utilisation des données
              </h3>
              <p className="text-muted-foreground mb-2">
                Nous utilisons vos données personnelles pour :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Fournir et maintenir le Service</li>
                <li>Traiter vos transactions et envoyer les confirmations</li>
                <li>Vous envoyer des mises à jour et des informations</li>
                <li>Répondre à vos demandes, questions et suggestions</li>
                <li>Améliorer et optimiser notre Service</li>
                <li>Analyser les tendances d&apos;utilisation</li>
                <li>Détecter et prévenir les fraudes et les abus</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h3 className="font-semibold text-base mb-2">
                4. Base légale du traitement (RGPD)
              </h3>
              <p className="text-muted-foreground">
                En vertu du Règlement Général sur la Protection des Données
                (RGPD), nous collectons et traitons vos données personnelles sur
                la base de votre consentement explicite, que vous donnez lors de
                votre inscription en acceptant cette politique de
                confidentialité et les conditions d&apos;utilisation.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h3 className="font-semibold text-base mb-2">
                5. Partage des données
              </h3>
              <p className="text-muted-foreground mb-2">
                Nous ne partageons vos données personnelles que dans les
                circonstances suivantes :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>
                  Avec nos fournisseurs de services (hébergement, paiement,
                  email)
                </li>
                <li>
                  Si la loi l&apos;exige ou si nous avons une obligation légale
                </li>
                <li>
                  Pour protéger nos droits, votre sécurité ou celle
                  d&apos;autrui
                </li>
                <li>
                  En cas de fusion, acquisition ou liquidation de
                  l&apos;entreprise
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h3 className="font-semibold text-base mb-2">
                6. Sécurité des données
              </h3>
              <p className="text-muted-foreground">
                Nous mettons en place des mesures de sécurité techniques,
                administratives et physiques pour protéger vos données
                personnelles contre l&apos;accès non autorisé, la divulgation,
                la modification ou la destruction. Cependant, aucune méthode de
                transmission sur Internet n&apos;est entièrement sécurisée.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h3 className="font-semibold text-base mb-2">
                7. Droits des utilisateurs (RGPD)
              </h3>
              <p className="text-muted-foreground mb-2">
                Conformément au RGPD, vous avez les droits suivants :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>
                  <strong>Droit d&apos;accès</strong> : Vous pouvez demander une
                  copie de vos données personnelles
                </li>
                <li>
                  <strong>Droit de rectification</strong> : Vous pouvez corriger
                  les données inexactes
                </li>
                <li>
                  <strong>Droit à l&apos;oubli</strong> : Vous pouvez demander
                  la suppression de vos données
                </li>
                <li>
                  <strong>Droit de portabilité</strong> : Vous pouvez recevoir
                  vos données dans un format structuré
                </li>
                <li>
                  <strong>Droit d&apos;opposition</strong> : Vous pouvez vous
                  opposer au traitement de vos données
                </li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Pour exercer ces droits, veuillez nous contacter à :
                privacy@issatex.com
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h3 className="font-semibold text-base mb-2">
                8. Durée de conservation
              </h3>
              <p className="text-muted-foreground">
                Nous conservons vos données personnelles aussi longtemps que
                votre compte est actif ou selon les exigences légales. Vous
                pouvez demander la suppression de votre compte à tout moment.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h3 className="font-semibold text-base mb-2">9. Cookies</h3>
              <p className="text-muted-foreground">
                Nous utilisons des cookies pour améliorer votre expérience. Vous
                pouvez contrôler les cookies via les paramètres de votre
                navigateur. Veuillez noter que certains cookies sont essentiels
                au fonctionnement du Service.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h3 className="font-semibold text-base mb-2">
                10. Modifications de cette politique
              </h3>
              <p className="text-muted-foreground">
                Nous pouvons modifier cette politique de confidentialité à tout
                moment. Les modifications seront publiées sur cette page avec la
                date de mise à jour. Votre utilisation continue du Service après
                les modifications constitue votre acceptation de la politique
                modifiée.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h3 className="font-semibold text-base mb-2">11. Contact</h3>
              <p className="text-muted-foreground">
                Si vous avez des questions concernant cette politique de
                confidentialité ou nos pratiques de protection des données,
                veuillez nous contacter à : privacy@issatex.com
              </p>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
