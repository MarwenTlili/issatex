<?php

namespace App\DataFixtures;

use App\Entity\Ilot;
use App\Entity\Machine;
use App\Enum\StatutMachine;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class MachineFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface {
    protected $faker;

    public const MACHINE_0 = "MACHINE_0";
    public const MACHINE_1 = "MACHINE_1";
    public const MACHINE_2 = "MACHINE_2";
    public const MACHINE_3 = "MACHINE_3";
    public const MACHINE_4 = "MACHINE_4";
    public const MACHINE_5 = "MACHINE_5";
    public const MACHINE_6 = "MACHINE_6";
    public const MACHINE_7 = "MACHINE_7";
    public const MACHINE_8 = "MACHINE_8";
    public const MACHINE_9 = "MACHINE_9";
    public const MACHINE_10 = "MACHINE_10";
    public const MACHINE_11 = "MACHINE_11";

    function load(ObjectManager $manager): void {
        $this->faker = Factory::create();

        /** @var Ilot $ilot_0 */
        $ilot_0 = $this->getReference(IlotFixtures::ILOT_0);

        /** @var Ilot $ilot_1 */
        $ilot_1 = $this->getReference(IlotFixtures::ILOT_1);

        for ($i = 0; $i < 12; $i++) {
            $machine = new Machine();
            $machine->setNom($this->faker->word() . '-' . $this->faker->numberBetween(100, 999))
                ->setStatutMachine(StatutMachine::DISPONIBLE)
                ->settype("Ring Spinning Machine")
                ->setIlot($i < 6 ? $ilot_0 : $ilot_1)
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
