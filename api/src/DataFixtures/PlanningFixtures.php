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
            array_push($ordreFabrications, $this->getReference("ORDRE_FABRICATION_$i"));
            $i++;
        }

        foreach ($ordreFabrications as $key => $of) {
            $dateCreation = $of->getDateCreation();
            if ($dateCreation instanceof \DateTime) {
                $planning = new Planning();
                $datePlanning = clone $dateCreation;
                $datePlanning->modify("+1 day");

                $dateDebut = clone $datePlanning;
                $dateDebut->modify("next monday");

                $dateFin = clone $dateDebut;
                $dateFin->modify("+6 days"); // add saturday to working day

                $planning->setDateCreation($datePlanning)
                    ->setDateDebut($dateDebut)
                    ->setDateFin($dateFin)
                    ->setReporte(false)
                    ->setOrdreFabrication($of)
                    // 2 première plannings dans la même Ilot
                    ->setIlot(
                        $key < 2
                            ? $this->getReference("ILOT_0")
                            : $this->getReference("ILOT_1")
                    )
                    // ->setIlot($key % 2 === 0 ? $this->getReference("ILOT_0") : $this->getReference("ILOT_1"))
                    // ->setIlot($this->getReference("ILOT_0"))
                ;

                $of->setLance(true);
                
                $manager->persist($of);
                $manager->persist($planning);

                $referenceName = "PLANNING_" . $key;
                $this->addReference($referenceName, $planning);
            }
        }

        $manager->flush();
    }

    public function getDependencies() {
        return [
            OrdreFabricationFixtues::class,
            IlotFixtures::class
        ];
    }

    public static function getGroups(): array {
        return ['load'];
    }
}
