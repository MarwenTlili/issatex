<?php

namespace App\Command;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Override;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * $ php bin/console app:create-admin
 */
#[AsCommand(
  name: 'app:create-admin',
  description: 'Create admin user interactively or via options'
)]
class CreateAdminCommand extends Command {
  public function __construct(
    private UserRepository $repo,
    private UserPasswordHasherInterface $hasher,
    private EntityManagerInterface $em,
  ) {
    parent::__construct();
  }

  #[Override]
  protected function configure() {
    $this->addOption('username', null, InputOption::VALUE_REQUIRED, 'Admin username')
      ->addOption('email', null, InputOption::VALUE_REQUIRED, 'Admin email')
      ->addOption('password', null, InputOption::VALUE_REQUIRED, 'Admin password');
  }

  #[Override]
  protected function execute(InputInterface $input, OutputInterface $output): int {
    $io = new SymfonyStyle($input, $output);

    // 1. Collect Data
    $email = $input->getOption('email') ?? $io->ask('Email');
    $username = $input->getOption('username') ?? $io->ask('Username');
    $password = $input->getOption('password') ?? $io->askHidden('Password');

    // 2. Validate
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      $io->error('Invalid email format.');
      return Command::FAILURE;
    }

    if ($this->repo->findOneBy(['email' => $email])) {
      $io->warning(sprintf('User with email "%s" already exists.', $email));
      return Command::FAILURE;
    }

    // 3. Create Entity
    $user = new User();
    $user->setEmail($email);
    $user->setUsername($username);
    $user->setRoles(['ROLE_ADMIN']);

    $hashedPassword = $this->hasher->hashPassword($user, $password);
    $user->setPassword($hashedPassword);

    $this->em->persist($user);
    $this->em->flush();

    $io->success(sprintf('Admin user "%s" was created successfully!', $username));

    return Command::SUCCESS;
  }
}
