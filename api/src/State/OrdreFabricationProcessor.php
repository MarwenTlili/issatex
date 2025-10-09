<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\OrdreFabrication;
use App\Service\OrdreFabricationStatusService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class OrdreFabricationProcessor implements ProcessorInterface {
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $persistProcessor,
        private EntityManagerInterface $em,
        private OrdreFabricationStatusService $statusService,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []) {
        if (!$data instanceof OrdreFabrication) {
            return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
        }

        // Keep a copy of the old statut before persist
        $originalData = null;
        if ($data->getId()) {
            $originalData = $this->em->getUnitOfWork()->getOriginalEntityData($data);
        }

        // Let Doctrine persist/update the OF entity
        $result = $this->persistProcessor->process($data, $operation, $uriVariables, $context);

        // Now handle the statut change
        if ($originalData && isset($originalData['statut'])) {
            $oldStatut = $originalData['statut'];
            $newStatut = $data->getStatut();

            if ($oldStatut !== $newStatut) {
                $this->statusService->handleStatusChange($data, $oldStatut, $newStatut);
            }
        }

        return $result;
    }
}
