<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use App\Enum\StatutPresence;
use App\Repository\PresenceRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PresenceRepository::class)]
#[ApiResource(
    paginationClientItemsPerPage: true,
    normalizationContext: ['groups' => ['presence']]
)]
#[ApiFilter(
    SearchFilter::class,
    properties: [
        "ref" => "ipartial",
        "employe" => "exact",
        "ilot" => "exact",
        "statut" => "exact"
    ]
)]
#[ApiFilter(DateFilter::class, properties: ['datePresence'])]
#[ApiFilter(
    OrderFilter::class,
    properties: [
        "ref",
        "datePresence" => "DESC",
        "statut",
        "ilot.nom"
    ]
)]
class Presence {
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "SEQUENCE")]
    #[ORM\Column(type: "integer")]
    #[Groups('presence')]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true, unique: true)]
    #[Groups('presence')]
    private ?string $ref = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups('presence')]
    private ?\DateTimeInterface $datePresence = null;

    #[ORM\Column(type: "time", nullable: true)]
    #[Groups('presence')]
    private ?\DateTimeInterface $heureDebut = null;

    #[ORM\Column(type: "time", nullable: true)]
    #[Groups('presence')]
    private ?\DateTimeInterface $heureFin = null;

    #[ORM\Column(type: "string", enumType: StatutPresence::class)]
    #[Groups('presence')]
    private ?StatutPresence $statut = null;

    #[ORM\Column]
    #[Groups('presence')]
    private ?int $tempsPresence = null;

    #[ORM\ManyToOne(inversedBy: 'presences')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups('presence')]
    private ?Employe $employe = null;

    #[ORM\ManyToOne(inversedBy: 'presences')]
    #[Groups('presence')]
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

    public function setHeureDebut(?\DateTimeInterface $heureDebut): static {
        $this->heureDebut = $heureDebut;
        return $this;
    }

    public function getHeureFin(): ?\DateTimeInterface {
        return $this->heureFin;
    }

    public function setHeureFin(?\DateTimeInterface $heureFin): static {
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
}
