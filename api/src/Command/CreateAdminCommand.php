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
#[AsCommand(name: 'app:create-admin')]
class CreateAdminCommand extends Command {
  public function __construct(
    private UserRepository $repo,
    private UserPasswordHasherInterface $hasher,
    private EntityManagerInterface $em,
  ) {
    parent::__construct();
  }

  protected function execute(InputInterface $input, OutputInterface $output): int {
    $email = getenv('ADMIN_EMAIL');
    $username = getenv('ADMIN_USERNAME');

    if ($this->repo->findOneBy(['email' => $email])) {
      $output->writeln('Admin already exists.');
      return Command::SUCCESS;
    }

    $user = new User();
    $user->setEmail($email)
      ->setUsername($username)
      ->setPassword(
        $this->hasher->hashPassword($user, getenv('ADMIN_PASSWORD'))
      )
      ->setRoles(['ROLE_ADMIN'])
      ->setEnabled(true);

    $this->em->persist($user);
    $this->em->flush();

    $output->writeln('Admin created.');

    return Command::SUCCESS;
  }
}
