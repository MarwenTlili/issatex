<?php

namespace App\DataFixtures;

use App\Entity\OrdreFabrication;
use App\Entity\Planning;
use App\Enum\StatutOF;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class PlanningFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface {
    protected $faker;

    public function load(ObjectManager $manager): void {
        $this->faker = Factory::create();

        /** @var OrdreFabrication[] */
        $ofs = [];
        $i = 0;
        while ($this->hasReference("ORDRE_FABRICATION_$i")) {
            $ofs[] = $this->getReference("ORDRE_FABRICATION_$i");
            $i++;
        }

        foreach ($ofs as $key => $of) {
            $statut = $of->getStatut();

            /**
             * No plannings for those status
             */
            if (in_array($of->getStatut(), [StatutOF::DRAFT])) {
                continue;
            }

            /**
             * Compute planning week based on status
             */
            if ($statut === StatutOF::PLANNED) {
                // Future week
                $monday = (new \DateTime())->modify('+1 week')->modify("Monday this week")->setTime(0, 0);
                $saturday = (clone $monday)->modify('+5 days');
            }

            if ($statut === StatutOF::IN_PROGRESS) {
                // This week
                $monday = (new \DateTime("now"))->modify("Monday this week")->setTime(0, 0);
                $saturday = (clone $monday)->modify('+5 days');
            }

            if ($statut === StatutOF::COMPLETED) {
                // Past week
                $monday = (new \DateTime())->modify('-2 weeks')->modify("Monday this week")->setTime(0, 0);
                $saturday = (clone $monday)->modify('+5 days');
            }

            if ($statut === StatutOF::CANCELED) {
                // Random: past or future week
                if ($this->faker->boolean(50)) {
                    // past
                    $monday = (new \DateTime())->modify('-1 weeks')->modify("Monday this week")->setTime(0, 0);
                } else {
                    // future
                    $monday = (new \DateTime())->modify('+2 weeks')->modify("Monday this week")->setTime(0, 0);
                }
                $saturday = (clone $monday)->modify('+5 days');
            }

            /**
             * Create the Planning entity
             */
            $planning = new Planning();
            $planning->setDateCreation($this->faker->dateTimeBetween('-1 week', 'now'))
                ->setDateDebut($monday)
                ->setDateFin($saturday)
                ->setReporte(false)
                ->setOrdreFabrication($of)
                ->setIlot(($key % 2 === 0) ? $this->getReference("ILOT_0") : $this->getReference("ILOT_1"));

            $manager->persist($planning);
            $this->addReference("PLANNING_$key", $planning);
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
