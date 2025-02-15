<?php

namespace App\DataFixtures;

use App\Entity\Employe;
use App\Enum\PosteEmploye;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class EmployeFixtures extends Fixture implements FixtureGroupInterface {
    protected $faker;

    function load(ObjectManager $manager): void {
        $this->faker = Factory::create();

        $postes = PosteEmploye::cases();

        for ($i = 0; $i < 12; $i++) {
            $employe = new Employe();
            $employe->setNom($this->faker->firstName())
                ->setPrenom($this->faker->lastName())
                ->setPoste($this->faker->randomElement($postes)->value)
            ;

            $manager->persist($employe);

            $referenceName = "EMPLOYE_" . $i;
            $this->addReference($referenceName, $employe);
        }

        $manager->flush();
    }

    public static function getGroups(): array {
        return ['load'];
    }
}
