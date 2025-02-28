<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Faker\Factory;

class UserFixtures extends Fixture implements FixtureGroupInterface {
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
            ->setRoles(["ROLE_ADMIN"]);
        $manager->persist($admin);
        $this->addReference("USER_0", $admin);

        // secretaire
        $secretaire = new User();
        $secretaire->setUsername("secretaire")
            ->setEmail("secretaire@example.com")
            ->setPassword($this->passwordHasher->hashPassword($secretaire, "secretaire"))
            ->setRoles(["ROLE_SECRETAIRE"]);
        $manager->persist($secretaire);
        $this->addReference("USER_1", $secretaire);

        // clients
        for ($i = 2; $i < 4; $i++) {
            $email = $this->faker->email();
            $username = explode('@', $email)[0];

            $user = new User();
            $user->setUsername($username)
                ->setEmail($email)
                ->setPassword($this->passwordHasher->hashPassword($user, $username))
                ->setRoles(["ROLE_USER"]);

            $manager->persist($user);

            $referenceName = "USER_" . $i;
            $this->addReference($referenceName, $user);
        }

        $manager->flush();
    }

    public static function getGroups(): array {
        return ['load'];
    }
}
