<?php

namespace App\DataFixtures;

use App\Entity\Ilot;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class IlotFixtures extends Fixture {
    protected $faker;

    public const ILOT_0 = "ILOT_0";
    public const ILOT_1 = "ILOT_1";

    function load(ObjectManager $manager): void {
        $this->faker = Factory::create();

        for ($i = 0; $i < 2; $i++) {
            $ilot = new Ilot();
            $ilot->setNom("Ilot_" . $i)
                ->setDescription($this->faker->sentence(3))
            ;
            $manager->persist($ilot);
            $referenceName = "ILOT_" . $i;
            $this->addReference($referenceName, $ilot);
        }

        $manager->flush();
    }
}
