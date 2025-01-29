<?php

namespace App\DataFixtures;

use App\Entity\Employe;
use App\Entity\Ilot;
use App\Enum\PosteEmploye;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class EmployeFixtures extends Fixture implements FixtureGroupInterface {
    protected $faker;

    public const EMPLOYE_0 = "EMPLOYE_0";
    public const EMPLOYE_1 = "EMPLOYE_1";
    public const EMPLOYE_2 = "EMPLOYE_2";
    public const EMPLOYE_3 = "EMPLOYE_3";
    public const EMPLOYE_4 = "EMPLOYE_4";
    public const EMPLOYE_5 = "EMPLOYE_5";
    public const EMPLOYE_6 = "EMPLOYE_6";
    public const EMPLOYE_7 = "EMPLOYE_7";
    public const EMPLOYE_8 = "EMPLOYE_8";
    public const EMPLOYE_9 = "EMPLOYE_9";
    public const EMPLOYE_10 = "EMPLOYE_10";
    public const EMPLOYE_11 = "EMPLOYE_11";

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
