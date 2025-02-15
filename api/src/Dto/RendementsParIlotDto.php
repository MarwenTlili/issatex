<?php

namespace App\Dto;

use Symfony\Component\Serializer\Annotation\Groups;

final class RendementsParIlotDto {
    #[Groups(['rendements_par_ilot_dto:read'])]
    public int $ilot;

    #[Groups(['rendements_par_ilot_dto:read'])]
    public int $nbrEmples;

    #[Groups(['rendements_par_ilot_dto:read'])]
    public int $nbrOfTraites;

    #[Groups(['rendements_par_ilot_dto:read'])]
    public int $quantitesTotales;

    #[Groups(['rendements_par_ilot_dto:read'])]
    public int $tempsPresenceMin;

    #[Groups(['rendements_par_ilot_dto:read'])]
    public int $tempsProductif;

    #[Groups(['rendements_par_ilot_dto:read'])]
    public float $rendement;

    public function __construct(
        int $ilot,
        int $nbrEmples,
        int $nbrOfTraites,
        int $quantitesTotales,
        int $tempsPresenceMin,
        int $tempsProductif,
        float $rendement
    ) {
        $this->ilot = $ilot;
        $this->nbrEmples = $nbrEmples;
        $this->nbrOfTraites = $nbrOfTraites;
        $this->quantitesTotales = $quantitesTotales;
        $this->tempsPresenceMin = $tempsPresenceMin;
        $this->tempsProductif = $tempsProductif;
        $this->rendement = $rendement;
    }

    public static function fromArray(array $row): self {
        return new self(
            (int) $row['ilot'],
            (int) $row['nbr_emples'],
            (int) $row['nbr_of_traites'],
            (int) $row['quantites_totales'],
            (int) $row['temps_presence_min'],
            (int) $row['temps_productif'],
            (float) $row['rendement']
        );
    }
}
