<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\Dto\RendementDto;
use App\State\RendementProvider;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/rendements/{date}',
            name: 'get_rendements',
            output: RendementDto::class,
            provider: RendementProvider::class,
            normalizationContext: ['groups' => ['rendement:read']]
        )
    ]
)]
final class Rendement {
}
