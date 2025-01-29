<?php

namespace App\DataFixtures;

use App\Entity\OrdreFabrication;
use App\Entity\Planning;
use App\Entity\Production;
use App\Enum\TailleArticle;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class ProductionFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface {
    protected $faker;

    public function load(ObjectManager $manager): void {
        $this->faker = Factory::create();

        /** @var Planning $planning_0 */
        $planning_0 = $this->getReference(PlanningFixtures::PLANNING_0);

        /** @var Planning $planning_1 */
        $planning_1 = $this->getReference(PlanningFixtures::PLANNING_1);

        $plannings = [$planning_0, $planning_1];

        $taillesArticle = [TailleArticle::L, TailleArticle::M, TailleArticle::XL];

        $j = 0;
        foreach ($plannings as $planning) {
            /** @var OrdreFabrication $of */
            $of = $planning->getOrdreFabrication();

            $dateDebut = $planning->getDateDebut();

            // Jours de Lundi->Samedi
            for ($i = 0; $i < 6; $i++) {
                if ($dateDebut instanceof \DateTime) {
                    $offset = $i % 6;

                    $jour = clone $dateDebut;
                    $jour->modify("+" . $offset . " day");

                    foreach ($taillesArticle as $key => $tailleArticle) {
                        $quantiteDemandee = $of->getQuantiteParTaille($tailleArticle);

                        $quantiteParJour = intval($quantiteDemandee / 6);
                        $quantitePremiereChoix = $this->faker->numberBetween($quantiteParJour - 5, $quantiteParJour);
                        $quantiteDeuxiemeChoix = $this->faker->numberBetween(1, 5);
                        $qantiteTotale = $quantitePremiereChoix + $quantiteDeuxiemeChoix;
                        $tempsProductif = $qantiteTotale * $of->getTempsUnitaire() / 100;

                        $production = new Production();
                        $production->setDateProduction($jour)
                            ->setTailleArticle($tailleArticle)
                            ->setQuantitePremiereChoix($quantitePremiereChoix)
                            ->setQuantiteDeuxiemeChoix($quantiteDeuxiemeChoix)
                            ->setQuantiteTotale($qantiteTotale)
                            ->setTempsProductif($tempsProductif)
                            ->setPlanning($planning)
                        ;
                        $manager->persist($production);

                        $referenceName = sprintf("PRODUCTION_%d_%s_%d", $i, $tailleArticle->value, $j);
                        $this->addReference($referenceName, $production);
                        $j += 1;
                    }
                }
            }
        }

        $manager->flush();
    }

    public function getDependencies() {
        return [
            PlanningFixtures::class,
            OrdreFabricationFixtues::class,
            TailleOrdreFabricationFixtures::class
        ];
    }

    public static function getGroups(): array {
        return ['load'];
    }
}
