<?php

namespace App\Command;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * $ php bin/console app:create-admin
 */
#[AsCommand(
  name: 'app:create-admin',
  description: "Create admin user using environment variables"
)]
class CreateAdminCommand extends Command {
  public function __construct(
    private UserRepository $repo,
    private UserPasswordHasherInterface $hasher,
    private EntityManagerInterface $em,
    private ?string $adminEmail,
    private ?string $adminUsername,
    private ?string $adminPassword
  ) {
    parent::__construct();
  }

  protected function execute(InputInterface $input, OutputInterface $output): int {
    if (!$this->adminEmail || !$this->adminUsername || !$this->adminPassword) {
      $output->writeln('<error>Missing ADMIN_* environment variables.</error>');
      return Command::FAILURE;
    }

    if ($this->repo->findOneBy(['email' => $this->adminEmail])) {
      $output->writeln('Admin already exists.');
      return Command::SUCCESS;
    }

    $user = new User();
    $user->setEmail($this->adminEmail)
      ->setUsername($this->adminUsername)
      ->setPassword(
        $this->hasher->hashPassword($user, $this->adminPassword)
      )
      ->setRoles(['ROLE_ADMIN'])
      ->setEnabled(true);

    $this->em->persist($user);
    $this->em->flush();

    $output->writeln('Default admin user created.');

    return Command::SUCCESS;
  }
}
