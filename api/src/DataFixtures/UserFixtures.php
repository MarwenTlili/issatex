<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Faker\Factory;

class UserFixtures extends Fixture implements FixtureGroupInterface, DependentFixtureInterface {
    private $passwordHasher;
    protected $faker;

    public function __construct(UserPasswordHasherInterface $passwordHasher) {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void {
        $this->faker = Factory::create();

        // admin
        $admin = new User();
        $admin->setUsername("admin")
            ->setEmail("admin@example.com")
            ->setPassword($this->passwordHasher->hashPassword($admin, "admin"))
            ->setRoles(["ROLE_ADMIN"])
            ->setAvatar($this->getReference("AVATAR_0"))
            ->setEnabled(true);
        $manager->persist($admin);
        $this->addReference("USER_0", $admin);

        // secretaire
        $secretaire = new User();
        $secretaire->setUsername("secretaire")
            ->setEmail("secretaire@example.com")
            ->setPassword($this->passwordHasher->hashPassword($secretaire, "secretaire"))
            ->setRoles(["ROLE_SECRETARY"])
            ->setEnabled(true);
        $manager->persist($secretaire);
        $this->addReference("USER_1", $secretaire);

        // Client 1
        $client1 = new User();
        $client1->setUsername("jameson")
            ->setEmail("jameson@example.com")
            ->setPassword($this->passwordHasher->hashPassword($client1, "jameson"))
            ->setRoles(["ROLE_CLIENT"])
            ->setEnabled(true);

        $manager->persist($client1);

        $referenceName = "USER_2";
        $this->addReference($referenceName, $client1);

        // Client 2
        $client2 = new User();
        $client2->setUsername("bartoletti")
            ->setEmail("bartoletti@example.com")
            ->setPassword($this->passwordHasher->hashPassword($client2, "bartoletti"))
            ->setRoles(["ROLE_CLIENT"]);

        $manager->persist($client2);

        $referenceName = "USER_3";
        $this->addReference($referenceName, $client2);

        $manager->flush();
    }

    function getDependencies() {
        return  [
            AvatarFixtures::class,
        ];
    }

    public static function getGroups(): array {
        return ['load'];
    }
}
