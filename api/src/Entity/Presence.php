<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Enum\StatutPresence;
use App\Repository\PresenceRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PresenceRepository::class)]
#[ApiResource(paginationClientItemsPerPage: true)]
class Presence {
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    #[ORM\Column(type: "integer")]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true, unique: true)]
    private ?string $ref = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $datePresence = null;

    #[ORM\Column(type: "time")]
    private ?\DateTimeInterface $heureDebut = null;

    #[ORM\Column(type: "time")]
    private ?\DateTimeInterface $heureFin = null;

    #[ORM\Column(type: "string", enumType: StatutPresence::class)]
    private ?StatutPresence $statut = null;

    #[ORM\Column]
    private ?int $tempsPresence = null;

    #[ORM\ManyToOne(inversedBy: 'presences')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Employe $employe = null;

    #[ORM\ManyToOne(inversedBy: 'presences')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Ilot $ilot = null;

    #[ORM\ManyToOne(inversedBy: 'presences')]
    private ?Planning $planning = null;

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

    public function getDatePresence(): ?\DateTimeInterface {
        return $this->datePresence;
    }

    public function setDatePresence(\DateTimeInterface $datePresence): static {
        $this->datePresence = $datePresence;
        return $this;
    }

    public function getHeureDebut(): ?\DateTimeInterface {
        return $this->heureDebut;
    }

    public function setHeureDebut(\DateTimeInterface $heureDebut): static {
        $this->heureDebut = $heureDebut;
        return $this;
    }

    public function getHeureFin(): ?\DateTimeInterface {
        return $this->heureFin;
    }

    public function setHeureFin(\DateTimeInterface $heureFin): static {
        $this->heureFin = $heureFin;

        return $this;
    }

    public function getStatut(): ?StatutPresence {
        return $this->statut;
    }

    public function setStatut(StatutPresence $statut): static {
        $this->statut = $statut;
        return $this;
    }

    public function getTempsPresence(): ?int {
        return $this->tempsPresence;
    }

    public function setTempsPresence(int $tempsPresence): static {
        $this->tempsPresence = $tempsPresence;
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

    public function getPlanning(): ?Planning
    {
        return $this->planning;
    }

    public function setPlanning(?Planning $planning): static
    {
        $this->planning = $planning;

        return $this;
    }
}
