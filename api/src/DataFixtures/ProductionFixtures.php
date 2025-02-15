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

        /** @var Planning[] $plannings */
        $plannings = [];
        for ($i = 0; $i < 3; $i++) {
            array_push($plannings, $this->getReference("PLANNING_" . $i));
        }

        $j = 0;
        foreach ($plannings as $planning) {
            /** @var OrdreFabrication $of */
            $of = $planning->getOrdreFabrication();

            $dateDebut = $planning->getDateDebut();

            if ($dateDebut instanceof \DateTime) {
                // Jours de Lundi->Samedi
                for ($i = 0; $i < 6; $i++) {
                    $offset = $i % 6;

                    $jour = clone $dateDebut;
                    $jour->modify("+" . $offset . " day");

                    foreach (TailleArticle::cases() as $key => $tailleArticle) {
                        $quantiteDemandee = $of->getQuantiteParTaille($tailleArticle);

                        $quantiteParJour = intval($quantiteDemandee / 6);
                        $quantitePremiereChoix = $this->faker->numberBetween($quantiteParJour - 10, $quantiteParJour);
                        $quantiteDeuxiemeChoix = $this->faker->numberBetween(1, 5);
                        $qantiteTotale = $quantitePremiereChoix + $quantiteDeuxiemeChoix;

                        $production = new Production();
                        $production->setDateProduction($jour)
                            ->setTailleArticle($tailleArticle)
                            ->setQuantitePremiereChoix($quantitePremiereChoix)
                            ->setQuantiteDeuxiemeChoix($quantiteDeuxiemeChoix)
                            ->setQuantiteTotale($qantiteTotale)
                            ->setPlanning($planning)
                        ;
                        $manager->persist($production);

                        $referenceName = sprintf("PRODUCTION_%d", $j);
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
            TailleOrdreFabricationFixtures::class,
            PlanningFixtures::class
        ];
    }

    public static function getGroups(): array {
        return ['load'];
    }
}
