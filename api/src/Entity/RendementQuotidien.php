<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\RendementQuotidienRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RendementQuotidienRepository::class)]
#[ApiResource]
class RendementQuotidien {
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    #[ORM\Column(type: "integer", unique: true)]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $ref = null;

    #[ORM\Column]
    private ?int $nbrEmployes = null;

    #[ORM\Column]
    private ?int $nbrOFTraites = null;

    #[ORM\Column]
    private ?int $quantiteTotale = null;

    #[ORM\Column]
    private ?int $rendement = null;

    #[ORM\ManyToOne(inversedBy: 'rendements')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Ilot $ilot = null;

    public function getId(): ?int {
        return $this->id;
    }

    public function getRef(): ?string {
        return $this->ref;
    }

    public function setRef(?string $ref): static {
        $this->ref = $ref;

        return $this;
    }

    public function getNbrEmployes(): ?int {
        return $this->nbrEmployes;
    }

    public function setNbrEmployes(int $nbrEmployes): static {
        $this->nbrEmployes = $nbrEmployes;

        return $this;
    }

    public function getNbrOFTraites(): ?int {
        return $this->nbrOFTraites;
    }

    public function setNbrOFTraites(int $nbrOFTraites): static {
        $this->nbrOFTraites = $nbrOFTraites;

        return $this;
    }

    public function getQuantiteTotale(): ?int {
        return $this->quantiteTotale;
    }

    public function setQuantiteTotale(int $quantiteTotale): static {
        $this->quantiteTotale = $quantiteTotale;

        return $this;
    }

    public function getRendement(): ?int {
        return $this->rendement;
    }

    public function setRendement(int $rendement): static {
        $this->rendement = $rendement;

        return $this;
    }

    public function getIlot(): ?Ilot {
        return $this->ilot;
    }

    public function setIlot(?Ilot $ilot): static {
        $this->ilot = $ilot;

        return $this;
    }
}
