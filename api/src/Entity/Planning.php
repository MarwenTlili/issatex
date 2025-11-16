<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\PlanningRepository;
use App\State\PlanningStateProcessor;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Table(
    name: "planning",
    options: [
        "check" => "date_debut < date_fin",
        "check" => "date_debut >= date_creation"
    ]
)]
#[ORM\Entity(repositoryClass: PlanningRepository::class)]
#[ApiResource(
    paginationClientItemsPerPage: true,
    processor: PlanningStateProcessor::class,
    operations: [
        new Post(),
        new GetCollection(),
        new Get(),
        new Patch(),
        new Delete()
    ],
    order: ['dateCreation' => 'DESC'],   // default order
    normalizationContext: ['groups' => ['planning:read']],
    denormalizationContext: ['groups' => ['planning:write']],
)]
#[ApiFilter(
    SearchFilter::class,
    properties: [
        "ref" => "ipartial",
        "ordreFabrication" => "exact",
        "ilot" => "exact",
        "dateCreation" => "exact",
        "dateDebut" => "exact",
        "dateFin" => "exact",
    ]
)]
// ?order[property]=<DESC|ASC>
#[ApiFilter(
    OrderFilter::class,
    properties: [
        "dateCreation" => "DESC"
    ]
)]
class Planning {
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "SEQUENCE")]
    #[ORM\Column(type: "integer")]
    #[Groups(['planning:read', 'ordreFabrication:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true, unique: true)]
    #[Groups(['planning:read', 'ordreFabrication:read'])]
    private ?string $ref = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['planning:read', 'planning:write', 'ordreFabrication:read'])]
    private ?\DateTime $dateCreation = null;

    #[Assert\GreaterThanOrEqual(propertyPath: "date_creation", message: "La date de debut doit être postérieure à la date de création.")]
    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['planning:read', 'planning:write', 'ordreFabrication:read'])]
    private ?\DateTime $dateDebut = null;

    #[Assert\GreaterThan(propertyPath: "date_debut", message: "La date de fin doit être postérieure à la date de début.")]
    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['planning:read', 'planning:write', 'ordreFabrication:read'])]
    private ?\DateTime $dateFin = null;

    #[ORM\Column(type: "boolean", options: ["default" => false])]
    #[Groups(['planning:read', 'planning:write', 'ordreFabrication:read'])]
    private ?bool $reporte = null;

    #[ORM\ManyToOne(inversedBy: 'plannings')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['planning:read', 'planning:write'])]
    private ?OrdreFabrication $ordreFabrication = null;

    #[ORM\ManyToOne(inversedBy: 'plannings')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['planning:read', 'planning:write', 'ordreFabrication:read'])]
    private ?Ilot $ilot = null;

    /**
     * @var Collection<int, Production>
     */
    #[ORM\OneToMany(mappedBy: 'planning', targetEntity: Production::class, orphanRemoval: true)]
    #[Groups(['planning:read', 'ordreFabrication:read'])]
    private Collection $productions;

    public function __construct() {
        $this->productions = new ArrayCollection();
    }

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

    public function getDateCreation(): ?\DateTime {
        return $this->dateCreation;
    }

    public function setDateCreation(\DateTime $dateCreation): static {
        $this->dateCreation = $dateCreation;
        return $this;
    }

    public function getDateDebut(): ?\DateTime {
        return $this->dateDebut;
    }

    public function setDateDebut(\DateTime $dateDebut): static {
        $this->dateDebut = $dateDebut;
        return $this;
    }

    public function getDateFin(): ?\DateTime {
        return $this->dateFin;
    }

    public function setDateFin(\DateTime $dateFin): static {
        $this->dateFin = $dateFin;
        return $this;
    }

    public function isReporte(): ?bool {
        return $this->reporte;
    }

    public function setReporte(bool $reporte): static {
        $this->reporte = $reporte;

        return $this;
    }

    public function getOrdreFabrication(): ?OrdreFabrication {
        return $this->ordreFabrication;
    }

    public function setOrdreFabrication(?OrdreFabrication $ordreFabrication): static {
        $this->ordreFabrication = $ordreFabrication;
        return $this;
    }

    public function getIlot(): ?Ilot {
        return $this->ilot;
    }

    public function setIlot(?Ilot $ilot): static {
        $this->ilot = $ilot;
        return $this;
    }

    /**
     * @return Collection<int, Production>
     */
    public function getProductions(): Collection {
        return $this->productions;
    }

    public function addProduction(Production $production): static {
        if (!$this->productions->contains($production)) {
            $this->productions->add($production);
            $production->setPlanning($this);
        }

        return $this;
    }

    public function removeProduction(Production $production): static {
        if ($this->productions->removeElement($production)) {
            // set the owning side to null (unless already changed)
            if ($production->getPlanning() === $this) {
                $production->setPlanning(null);
            }
        }

        return $this;
    }
}
