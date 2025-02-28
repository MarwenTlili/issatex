<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\AffectationEmployeIlotRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AffectationEmployeIlotRepository::class)]
#[ApiResource(paginationClientItemsPerPage: true)]
class AffectationEmployeIlot {
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "SEQUENCE")]
    #[ORM\Column(type: "integer")]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true, unique: true)]
    private ?string $ref = null;

    #[ORM\Column(nullable: true)]
    private ?bool $responsable = null;

    #[ORM\ManyToOne(inversedBy: 'ilotEmployes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Employe $employe = null;

    #[ORM\ManyToOne(inversedBy: 'ilotEmployes')]
    #[ORM\JoinColumn(nullable: false)]
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

    public function isResponsable(): ?bool {
        return $this->responsable;
    }

    public function setResponsable(bool $responsable): static {
        $this->responsable = $responsable;
        return $this;
    }

    public function getEmploye(): ?Employe {
        return $this->employe;
    }

    public function setEmploye(?Employe $employe): static {
        $this->employe = $employe;
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
