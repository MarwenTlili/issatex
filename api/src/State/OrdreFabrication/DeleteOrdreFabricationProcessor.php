<?php

namespace App\State\OrdreFabrication;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\OrdreFabrication;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class DeleteOrdreFabricationProcessor implements ProcessorInterface {
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.remove_processor')]
        private ProcessorInterface $removeProcessor,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []) {
        if ($data instanceof OrdreFabrication && $data->isLance()) {
            throw new BadRequestHttpException('Impossible de supprimer un ordre de fabrication lancé');
        }

        return $this->removeProcessor->process($data, $operation, $uriVariables, $context);
    }
}
