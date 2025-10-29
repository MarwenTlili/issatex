<?php

namespace App\State\OrdreFabrication;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\OrdreFabrication;
use App\Enum\StatutOF;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class CreateOrdreFabricationProcessor implements ProcessorInterface {
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $persistProcessor,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []) {
        if (!$data instanceof OrdreFabrication) {
            return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
        }

        // Example: initialize default values on creation
        $data->setStatut(StatutOF::CREE)
            ->setDateCreation(new \DateTimeImmutable())
            ->setLance(false);

        // Persist entity
        $result = $this->persistProcessor->process($data, $operation, $uriVariables, $context);

        return $result;
    }
}
