<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Post;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Planning;
use App\Enum\StatutOF;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

final class PlanningStateProcessor implements ProcessorInterface {
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $persistProcessor,
        private EntityManagerInterface $entityManager
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []) {
        if (!$data instanceof Planning) {
            return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
        }

        if ($operation instanceof Post) {
            $ordreFabrication = $data->getOrdreFabrication();
            $ordreFabrication->setStatut(StatutOF::PLANIFIE)
                ->setLance(true);
            $this->entityManager->persist($ordreFabrication);
        }

        if ($operation instanceof Delete) {
            $ordreFabrication = $data->getOrdreFabrication();
            $ordreFabrication->setStatut(StatutOF::ANNULE)
                ->setLance(false);
            $this->entityManager->persist($ordreFabrication);
            $this->entityManager->flush();
        }

        // Delegate to default Doctrine persist processor
        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
