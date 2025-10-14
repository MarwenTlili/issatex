<?php

namespace App\Command;

use ApiPlatform\Metadata\IriConverterInterface;
use App\Repository\NotificationRepository;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * $ php bin/console debug:iri
 */
#[AsCommand(name: 'debug:iri')]
class DebugIriCommand extends Command {
    public function __construct(
        private NotificationRepository $notifications,
        private IriConverterInterface $iriConverter
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int {
        $notif = $this->notifications->findOneBy([]); // pick one for demo
        if (!$notif) {
            $output->writeln('No notification found.');
            return Command::FAILURE;
        }

        $iri = $this->iriConverter->getIriFromResource($notif->getAccount());
        $output->writeln("IRI for getAccount(): $iri");
        return Command::SUCCESS;
    }
}
