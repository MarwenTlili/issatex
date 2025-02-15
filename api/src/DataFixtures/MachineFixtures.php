<?php

namespace App\DataFixtures;

use App\Entity\Ilot;
use App\Entity\Machine;
use App\Enum\StatutMachine;
use App\Enum\TypeMachine;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class MachineFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface {
    protected $faker;

    function load(ObjectManager $manager): void {
        $this->faker = Factory::create();

        /** @var Ilot[] */
        $ilots = [];
        $i = 0;
        while ($this->hasReference("ILOT_$i")) {
            array_push($ilots, $this->getReference("ILOT_$i"));
            $i++;
        }

        for ($i = 0; $i < 12; $i++) {
            $machine = new Machine();
            $machine->setNom($this->faker->word() . '-' . $this->faker->numberBetween(100, 999))
                ->setStatut(StatutMachine::DISPONIBLE)
                ->settype($this->faker->randomElement(TypeMachine::cases())->value)
                ->setIlot($i < 6 ? $ilots[0] : $ilots[1])
            ;
            $manager->persist($machine);

            $referenceName = "MACHINE_" . $i;
            $this->addReference($referenceName, $machine);
        }

        $manager->flush();
    }

    public function getDependencies() {
        return [
            IlotFixtures::class,
        ];
    }

    public static function getGroups(): array {
        return ['load'];
    }
}
