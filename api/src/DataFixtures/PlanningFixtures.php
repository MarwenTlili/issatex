<?php

namespace App\DataFixtures;

use App\Entity\OrdreFabrication;
use App\Entity\Planning;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class PlanningFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface {
    protected $faker;

    public function load(ObjectManager $manager): void {
        $this->faker = Factory::create();

        /** @var OrdreFabrication[] $ordreFabrications */
        $ordreFabrications = [];
        $i = 0;
        while ($this->hasReference("ORDRE_FABRICATION_$i")) {
            $ordreFabrications[] = $this->getReference("ORDRE_FABRICATION_$i");
            $i++;
        }

        foreach ($ordreFabrications as $key => $of) {
            $planning = new Planning();

            if ($key === (count($ordreFabrications) - 1)) {
                // 👈 Last planning always covers THIS week
                $dateDebut = new \DateTimeImmutable('last monday');
                $dateFin   = (clone $dateDebut)->modify('+6 days'); // until Saturday
                $dateCreation = (clone $dateDebut)->modify('-1 day');
            } else {
                // Other plannings can still be random (previous weeks)
                $dateCreation = $this->faker->dateTimeBetween("-3 week", "-1 week");
                $dateDebut = (clone $dateCreation)->modify("next monday");
                $dateFin   = (clone $dateDebut)->modify("+6 days");
            }

            $planning->setDateCreation($dateCreation)
                ->setDateDebut($dateDebut)
                ->setDateFin($dateFin)
                ->setReporte(false)
                ->setOrdreFabrication($of)
                ->setIlot($key < 2 ? $this->getReference("ILOT_0") : $this->getReference("ILOT_1"));

            $of->setLance(true);

            $manager->persist($of);
            $manager->persist($planning);

            $referenceName = "PLANNING_" . $key;
            $this->addReference($referenceName, $planning);
        }

        $manager->flush();
    }

    public function getDependencies() {
        return [
            OrdreFabricationFixtues::class,
            IlotFixtures::class,
        ];
    }

    public static function getGroups(): array {
        return ['load'];
    }
}
