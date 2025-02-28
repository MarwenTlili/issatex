<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\PlanningRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Table(
    name: "planning",
    options: [
        "check" => "date_debut < date_fin",
        "check" => "date_debut > date_creation"
    ]
)]
#[ORM\Entity(repositoryClass: PlanningRepository::class)]
#[ApiResource(paginationClientItemsPerPage: true)]
class Planning {
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "SEQUENCE")]
    #[ORM\Column(type: "integer")]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true, unique: true)]
    private ?string $ref = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $dateCreation = null;

    #[Assert\GreaterThan(propertyPath: "date_creation", message: "La date de debut doit être postérieure à la date de création.")]
    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $dateDebut = null;

    #[Assert\GreaterThan(propertyPath: "date_debut", message: "La date de fin doit être postérieure à la date de début.")]
    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $dateFin = null;

    #[ORM\Column(type: "boolean", options: ["default" => false])]
    private ?bool $reporte = null;

    #[ORM\ManyToOne(inversedBy: 'plannings')]
    #[ORM\JoinColumn(nullable: false)]
    private ?OrdreFabrication $ordreFabrication = null;

    #[ORM\ManyToOne(inversedBy: 'plannings')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Ilot $ilot = null;

    /**
     * @var Collection<int, Production>
     */
    #[ORM\OneToMany(mappedBy: 'planning', targetEntity: Production::class, orphanRemoval: true)]
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

    public function getDateCreation(): ?\DateTimeInterface {
        return $this->dateCreation;
    }

    public function setDateCreation(\DateTimeInterface $dateCreation): static {
        $this->dateCreation = $dateCreation;
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
