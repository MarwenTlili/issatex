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

    public const PLANNING_0 = "PLANNING_0";
    public const PLANNING_1 = "PLANNING_1";

    public function load(ObjectManager $manager): void {
        $this->faker = Factory::create();

        /** @var OrdreFabrication $of_0 */
        $of_0 = $this->getReference(OrdreFabricationFixtues::OF_0);

        /** @var OrdreFabrication $of_1 */
        $of_1 = $this->getReference(OrdreFabricationFixtues::OF_1);

        $ofs = [$of_0, $of_1];

        foreach ($ofs as $key => $of) {
            $dateCreation = $of->getDateCreation();
            if ($dateCreation instanceof \DateTime) {
                $planning = new Planning();
                $datePlanning = clone $dateCreation;
                $datePlanning->modify("+1 day");

                $dateDebut = clone $datePlanning;
                $dateDebut->modify("next monday");

                $dateFin = clone $dateDebut;
                $dateFin->modify("+5 days");

                $planning->setDateCreation($datePlanning)
                    ->setDateDebut($dateDebut)
                    ->setDateFin($dateFin)
                    ->setOrdreFabrication($of)
                    // ->setIlot($key % 2 === 0 ? $this->getReference("ILOT_0") : $this->getReference("ILOT_1"))
                    ->setIlot($this->getReference("ILOT_0"))
                ;
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
