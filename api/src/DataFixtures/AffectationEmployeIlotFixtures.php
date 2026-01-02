<?php

namespace App\DataFixtures;

use App\Entity\AffectationEmployeIlot;
use App\Entity\Employe;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class AffectationEmployeIlotFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface {
    protected $faker;

    function load(ObjectManager $manager): void {
        $this->faker = Factory::create();

        /** @var Employe[] */
        $employes = [];
        $i = 0;
        while ($this->hasReference("EMPLOYE_$i")) {
            array_push($employes, $this->getReference("EMPLOYE_$i"));
            $i++;
            // The rest of employes are just for testing back-end filter
            if ($i == 12) break;
        }

        foreach ($employes as $key => $employe) {
            $affectation = new AffectationEmployeIlot();
            $affectation->setResponsable($key === 0 || $key === 6)
                ->setEmploye($employe)
                ->setIlot($key < 6 ? $this->getReference("ILOT_0") : $this->getReference("ILOT_1"));

            $manager->persist($affectation);
            $referenceName = "AFFECTATION_" . $key;
            $this->addReference($referenceName, $affectation);
        }

        $manager->flush();
    }

    public function getDependencies() {
        return [
            EmployeFixtures::class,
            IlotFixtures::class
        ];
    }

    public static function getGroups(): array {
        return ['load'];
    }
}
