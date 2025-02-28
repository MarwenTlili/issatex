<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\MachineRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Enum\StatutMachine;

#[ORM\Entity(repositoryClass: MachineRepository::class)]
#[ApiResource(paginationClientItemsPerPage: true)]
class Machine {
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "SEQUENCE")]
    #[ORM\Column(type: "integer")]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true, unique: true)]
    private ?string $ref = null;

    #[ORM\Column(length: 255, unique: true)]
    private ?string $nom = null;

    #[ORM\Column(length: 255)]
    private ?string $type = null;

    #[ORM\Column(type: Types::STRING, enumType: StatutMachine::class)]
    private ?StatutMachine $statut;

    #[ORM\ManyToOne(inversedBy: 'machines')]
    private ?Ilot $ilot = null;

    public function getId(): ?int {
        return $this->id;
    }

    public function getRef(): ?string {
        return $this->ref;
    }

    public function setRef(string $ref): static {
        $this->ref = $ref;
        return $this;
    }

    public function getNom(): ?string {
        return $this->nom;
    }

    public function setNom(string $nom): static {
        $this->nom = $nom;
        return $this;
    }

    public function getType(): ?string {
        return $this->type;
    }

    public function setType(string $type): static {
        $this->type = $type;
        return $this;
    }

    public function getStatut(): ?StatutMachine {
        return $this->statut;
    }

    public function setStatut(?StatutMachine $statut): self {
        $this->statut = $statut;
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
