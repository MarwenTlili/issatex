<?php

namespace App\DataFixtures;

use App\Entity\Ilot;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class IlotFixtures extends Fixture {
    protected $faker;

    function load(ObjectManager $manager): void {
        $this->faker = Factory::create();

        $numberOfIlots = 2;

        for ($i = 0; $i < $numberOfIlots; $i++) {
            $letter = chr(65 + $i);
            $ilot = new Ilot();
            $ilot->setNom("Ilot_" . $letter)
                ->setDescription($this->faker->sentence(3))
            ;
            $manager->persist($ilot);
            $referenceName = "ILOT_" . $i;
            $this->addReference($referenceName, $ilot);
        }

        $manager->flush();
    }
}
