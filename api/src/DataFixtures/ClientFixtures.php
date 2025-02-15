<?php

namespace App\DataFixtures;

use App\Entity\Client;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class ClientFixtures extends Fixture {
    protected $faker;

    public function load(ObjectManager $manager): void {
        $this->faker = Factory::create();

        for ($i = 0; $i < 2; $i++) {
            $client = new Client();
            $company = $this->faker->unique()->word();
            $client->setNom($company)
                ->setEmail(strtolower(str_replace(" ", ".", $company))."@exemple.com")
                ->setAdresse($this->faker->address())
                ->setPrivilegie($i % 2 === 0);
            $manager->persist($client);

            $referenceName = "CLIENT_" . $i;
            $this->addReference($referenceName, $client);
        }

        $manager->flush();
    }
}
