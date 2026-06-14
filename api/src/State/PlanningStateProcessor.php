<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Post;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Planning;
use App\Enum\StatutOF;
use App\Service\OrdreFabricationStatusService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

final class PlanningStateProcessor implements ProcessorInterface {
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $persistProcessor,
        #[Autowire(service: 'api_platform.doctrine.orm.state.remove_processor')]
        private ProcessorInterface $removeProcessor,
        private EntityManagerInterface $entityManager,
        private OrdreFabricationStatusService $statusService,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []) {
        if (!$data instanceof Planning) {
            return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
        }

        $of = $data->getOrdreFabrication();

        // -----------------------------------------------------------
        //  CREATE PLANNING → OF = PREVUE
        // -----------------------------------------------------------
        if ($operation instanceof Post) {
            $old = $of->getStatut();
            $new = StatutOF::PREVUE;

            $of->setStatut($new);

            $this->statusService->handleStatusChange($of, $old, $new);
            $this->entityManager->persist($of);

            return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
        }

        // -----------------------------------------------------------
        //  DELETE PLANNING → OF = BROUILLON
        // -----------------------------------------------------------
        if ($operation instanceof Delete) {
            $old = $of->getStatut();
            $new = StatutOF::BROUILLON;

            $of->setStatut($new);

            $this->statusService->handleStatusChange($of, $old, $new);
            $this->entityManager->persist($of);
            $this->entityManager->flush();

            return $this->removeProcessor->process($data, $operation, $uriVariables, $context);
        }

        // Delegate to default Doctrine persist processor
        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
