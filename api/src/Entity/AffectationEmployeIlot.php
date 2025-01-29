<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\AffectationEmployeIlotRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\DBAL\Types\Types;

#[ORM\Entity(repositoryClass: AffectationEmployeIlotRepository::class)]
#[ApiResource]
class AffectationEmployeIlot {
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    #[ORM\Column(type: "integer")]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true, unique: true)]
    private ?string $ref = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $dateDebut = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $dateFin = null;

    #[ORM\Column(nullable: true)]
    private ?bool $estResponsable = null;

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

    public function getDateDebut(): ?\DateTimeInterface {
        return $this->dateDebut;
    }

    public function setDateDebut(\DateTimeInterface $dateDebut): static {
        $this->dateDebut = $dateDebut;
        return $this;
    }

    public function getDateFin(): ?\DateTimeInterface {
        return $this->dateFin;
    }

    public function setDateFin(\DateTimeInterface $dateFin): static {
        $this->dateFin = $dateFin;
        return $this;
    }


    public function isEstResponsable(): ?bool {
        return $this->estResponsable;
    }

    public function setEstResponsable(bool $estResponsable): static {
        $this->estResponsable = $estResponsable;
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
