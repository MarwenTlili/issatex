<?php

namespace App\State\OrdreFabrication;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\OrdreFabrication;
use App\Enum\StatutOF;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class DeleteOrdreFabricationProcessor implements ProcessorInterface {
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.remove_processor')]
        private ProcessorInterface $removeProcessor,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []) {
        if ($data instanceof OrdreFabrication) {
            match ($data->getStatut()) {
                StatutOF::IN_PROGRESS => throw new ConflictHttpException(
                    'Impossible de supprimer un ordre de fabrication en cours de production!'
                ),
                StatutOF::COMPLETED => throw new ConflictHttpException(
                    'Impossible de supprimer un ordre de fabrication terminé!'
                ),
                default => null,
            };
        }
        return $this->removeProcessor->process($data, $operation, $uriVariables, $context);
    }
}
