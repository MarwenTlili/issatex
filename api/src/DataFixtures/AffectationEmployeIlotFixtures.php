<?php

namespace App\DataFixtures;

use App\Entity\AffectationEmployeIlot;
use App\Entity\Planning;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class AffectationEmployeIlotFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface {
    protected $faker;

    function load(ObjectManager $manager): void {
        $this->faker = Factory::create();

        /** @var Planning $planning_0 */
        $planning_0 = $this->getReference(PlanningFixtures::PLANNING_0);

        /** @var Planning $planning_1 */
        $planning_1 = $this->getReference(PlanningFixtures::PLANNING_1);

        for ($i = 0; $i < 12; $i++) {
            $planning = $i < 6 ? $planning_0 : $planning_1;
            
            $affectation = new AffectationEmployeIlot();
            $affectation->setDateDebut($planning->getDateDebut())
                ->setDateFin($planning->getDateFin())
                ->setEstResponsable($i == 0 || $i == 6 ? true : false)
                ->setEmploye($this->getReference(sprintf("EMPLOYE_%d", $i)))
                ->setIlot($planning->getIlot())
            ;

            $manager->persist($affectation);
        }

        $manager->flush();
    }

    public function getDependencies() {
        return [
            IlotFixtures::class,
            EmployeFixtures::class,
            PlanningFixtures::class
        ];
    }

    public static function getGroups(): array {
        return ['load'];
    }
}
