<?php

namespace App\Dto;

use Symfony\Component\Serializer\Annotation\Groups;

final class RendementDto {
    #[Groups(['rendement:read'])]
    public int $ilot;

    #[Groups(['rendement:read'])]
    public int $nbrEmployes;

    #[Groups(['rendement:read'])]
    public int $nbrOfTraites;

    #[Groups(['rendement:read'])]
    public int $quantitesTotales;

    // #[Groups(['rendement:read'])]
    // public int $tempsPresenceMin;

    // #[Groups(['rendement:read'])]
    // public int $tempsProductif;

    #[Groups(['rendement:read'])]
    public float $rendement;

    public function __construct(
        int $ilot,
        int $nbrEmployes,
        int $nbrOfTraites,
        int $quantitesTotales,
        // int $tempsPresenceMin,
        // int $tempsProductif,
        float $rendement
    ) {
        $this->ilot = $ilot;
        $this->nbrEmployes = $nbrEmployes;
        $this->nbrOfTraites = $nbrOfTraites;
        $this->quantitesTotales = $quantitesTotales;
        // $this->tempsPresenceMin = $tempsPresenceMin;
        // $this->tempsProductif = $tempsProductif;
        $this->rendement = $rendement;
    }

    public static function fromArray(array $row): self {
        return new self(
            (int) $row['ilot'],
            (int) $row['nbr_employes'],
            (int) $row['nbr_of_traites'],
            (int) $row['quantites_totales'],
            // (int) $row['temps_presence_min'],
            // (int) $row['temps_productif'],
            (float) $row['rendement']
        );
    }
}
