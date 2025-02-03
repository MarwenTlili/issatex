<?php

namespace App\DataFixtures;

use App\Entity\Ilot;
use App\Entity\RendementQuotidien;
use App\Enum\StatutPresence;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class RendementQuotidienFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface {
    public function load(ObjectManager $manager): void {
        /** @var Ilot[] */
        $ilots = [
            $this->getReference(IlotFixtures::ILOT_0),
            $this->getReference(IlotFixtures::ILOT_1),
        ];

        $jour = $ilots[0]->getPlannings()[0]->getDateDebut();

        // ilots
        foreach ($ilots as $ilot) {
            $rendementQuotidien = new RendementQuotidien();
            $rendementQuotidien->setIlot($ilot);

            $quantiteTotale = 0;
            $tempsProduit = 0;
            $tempsPresenceTotale = 0;
            $employesPresents = [];
            $nombreOrdreFabricationTraites = count($ilot->getPlannings());

            // plannings
            foreach ($ilot->getPlannings() as $planning) {
                $ordreFabrication = $planning->getOrdreFabrication();

                // cmn converti en minutes
                $tempsUnitaire = $ordreFabrication->getTempsUnitaire() / 100;

                // production
                foreach ($planning->getProductions() as $production) {
                    if ($production->getDateProduction()->format('Y-m-d') === $jour->format('Y-m-d')) {
                        $quantiteTotale += $production->getQuantiteTotale();
                    }
                }
                $tempsProduit = $quantiteTotale * $tempsUnitaire;

                // presence
                foreach ($planning->getPresences() as $presence) {
                    if (
                        $presence->getDatePresence()->format('Y-m-d') === $jour->format('Y-m-d') &&
                        $presence->getStatut() === StatutPresence::PRESENT
                    ) {
                        $employeId = $presence->getEmploye()->getId();

                        if (!isset($employesPresents[$employeId])) {
                            array_push($employesPresents, $employeId);
                            $tempsPresenceTotale += $presence->getTempsPresence();
                        }
                    }
                }
            }

            $nbrEmployes = count($employesPresents);

            $tempsPresence = $tempsPresenceTotale * 60; // Conversion en minutes

            $rendement = $tempsPresence > 0 ? ($tempsProduit / $tempsPresence) * 100 : 0;

            $rendementQuotidien->setNbrEmployes($nbrEmployes)
                ->setNbrOFTraites($nombreOrdreFabricationTraites)
                ->setQuantiteTotale($quantiteTotale)
                ->setRendement(intval($rendement));

            $manager->persist($rendementQuotidien);
        }

        $manager->flush();
    }

    public function getDependencies() {
        return [
            IlotFixtures::class,
            OrdreFabricationFixtues::class,
            TailleOrdreFabricationFixtures::class,
            PlanningFixtures::class,
            PresenceFixtures::class,
            ProductionFixtures::class
        ];
    }

    public static function getGroups(): array {
        return ['load'];
    }
}
