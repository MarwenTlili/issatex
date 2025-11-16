<?php

namespace App\DataFixtures;

use App\Entity\Client;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class ClientFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface {
    protected $faker;

    public function load(ObjectManager $manager): void {
        $this->faker = Factory::create();

        /**
         * The reference for client company users start from 2, eg. USER_2, ...
         * USER_0 AND USER_1 are reserved for the admin and secretary
         */
        for ($i = 2; $i < 4; $i++) {
            $client = new Client();
            $company = $this->faker->unique()->word();
            $client->setNom($company)
                ->setAdresse($this->faker->address())
                ->setPrivilegie($i % 2 === 0)
                ->setAccount($this->getReference("USER_$i"));
            $manager->persist($client);
            $this->addReference("CLIENT_" . $i, $client);
        }

        $manager->flush();
    }

    function getDependencies() {
        return  [
            UserFixtures::class
        ];
    }

    public static function getGroups(): array {
        return ['load'];
    }
}
