<?php

namespace App\DataFixtures;

use App\Entity\Client;
use App\Enum\CategoryTextile;
use App\Enum\FocusMarche;
use App\Enum\TailleEntreprise;
use App\Enum\TypeEntreprise;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class ClientFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface {
    /** @var \Faker\Generator $faker */
    protected $faker;

    public function load(ObjectManager $manager): void {
        $this->faker = Factory::create('fr_FR');

        /**
         * The reference for client company users start from 2, eg. USER_2, ...
         * USER_0 AND USER_1 are reserved for the admin and secretary
         */
        for ($i = 2; $i < 4; $i++) {
            $client = new Client();
            $company = $this->faker->company();
            $allMarketValues = FocusMarche::values();
            $randomCount = $this->faker->numberBetween(1, count($allMarketValues));
            $selectedMarkets = $this->faker->randomElements($allMarketValues, $randomCount, false);

            $client->setNom($company)
                ->setPrenomResponsable($this->faker->firstName())
                ->setNomResponsable($this->faker->lastName())
                ->setTailleEntreprise($this->faker->randomElement(TailleEntreprise::cases()))
                ->setTypeEntreprise($this->faker->randomElement(TypeEntreprise::cases()))
                ->setCategoryTextile($this->faker->randomElement(CategoryTextile::cases()))
                ->setAdresse($this->faker->address())
                ->setVille($this->faker->city())
                ->setGouvernemental($this->faker->region())
                ->setCodePostal($this->faker->postcode())
                ->setPays($this->faker->country())
                ->setNumeroTelephone($this->faker->phoneNumber())
                ->setFocusMarche($selectedMarkets)
                ->setInformationsComplementaires($this->faker->paragraph())
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
