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
            $plannings[] = $this->getReference("PLANNING_" . $i);
        }

        $today = new \DateTimeImmutable("today");
        $j = 0;

        foreach ($plannings as $planning) {
            /** @var OrdreFabrication $of */
            $of = $planning->getOrdreFabrication();
            $dateDebut = $planning->getDateDebut();

            if ($dateDebut instanceof \DateTime) {
                for ($i = 0; $i < 6; $i++) {
                    $jour = (clone $dateDebut)->modify("+$i day");

                    if ($jour > $today) {
                        break; // stop, no production after today
                    }

                    // Force at least one production today
                    if ($i === 5 && $jour < $today) {
                        $jour = $today;
                    }

                    foreach (TailleArticle::cases() as $tailleArticle) {
                        $quantiteDemandee = $of->getQuantiteParTaille($tailleArticle);
                        $quantiteParJour = max(1, intval($quantiteDemandee / 6));

                        $quantitePremiereChoix = $this->faker->numberBetween(
                            max(1, $quantiteParJour - 10),
                            $quantiteParJour
                        );
                        $quantiteDeuxiemeChoix = $this->faker->numberBetween(1, 5);
                        $quantiteTotale = $quantitePremiereChoix + $quantiteDeuxiemeChoix;

                        $production = new Production();
                        $production->setDateProduction($jour)
                            ->setTailleArticle($tailleArticle)
                            ->setQuantitePremiereChoix($quantitePremiereChoix)
                            ->setQuantiteDeuxiemeChoix($quantiteDeuxiemeChoix)
                            ->setQuantiteTotale($quantiteTotale)
                            ->setPlanning($planning);

                        $manager->persist($production);

                        $referenceName = sprintf("PRODUCTION_%d", $j);
                        $this->addReference($referenceName, $production);
                        $j++;
                    }
                }
            }
        }

        $manager->flush();
    }

    public function getDependencies() {
        return [
            TailleOrdreFabricationFixtures::class,
            PlanningFixtures::class,
        ];
    }

    public static function getGroups(): array {
        return ['load'];
    }
}
