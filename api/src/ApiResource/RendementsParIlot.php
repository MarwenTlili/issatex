<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\Dto\RendementsParIlotDto;
use App\State\RendementsParIlotProvider;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/rendements_par_ilots/{date}',
            requirements: ['date' => '\d{4}-\d{2}-\d{2}'],
            name: 'get_rendements_par_ilot_dto',
            output: RendementsParIlotDto::class,
            provider: RendementsParIlotProvider::class,
            normalizationContext: ['groups' => ['rendements_par_ilot_dto:read']]
        )
    ]
)]
final class RendementsParIlot {
}
