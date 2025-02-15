<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\IlotRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: IlotRepository::class)]
#[ApiResource]
class Ilot {
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    #[ORM\Column(type: "integer")]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true, unique: true)]
    private ?string $ref = null;

    #[ORM\Column(length: 255, unique: true)]
    private ?string $nom = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    /**
     * @var Collection<int, Planning>
     */
    #[ORM\OneToMany(mappedBy: 'ilot', targetEntity: Planning::class, orphanRemoval: true)]
    private Collection $plannings;

    /**
     * @var Collection<int, Machine>
     */
    #[ORM\OneToMany(mappedBy: 'ilot', targetEntity: Machine::class)]
    private Collection $machines;

    /**
     * @var Collection<int, IlotEmploye>
     */
    #[ORM\OneToMany(mappedBy: 'ilot', targetEntity: AffectationEmployeIlot::class, orphanRemoval: true)]
    private Collection $affectations;

    public function __construct() {
        $this->plannings = new ArrayCollection();
        $this->machines = new ArrayCollection();
        $this->affectations = new ArrayCollection();
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

    public function getNom(): ?string {
        return $this->nom;
    }

    public function setNom(string $nom): static {
        $this->nom = $nom;
        return $this;
    }

    public function getDescription(): ?string {
        return $this->description;
    }

    public function setDescription(?string $description): static {
        $this->description = $description;
        return $this;
    }

    /**
     * @return Collection<int, Planning>
     */
    public function getPlannings(): Collection {
        return $this->plannings;
    }

    public function addPlanning(Planning $planning): static {
        if (!$this->plannings->contains($planning)) {
            $this->plannings->add($planning);
            $planning->setIlot($this);
        }
        return $this;
    }

    public function removePlanning(Planning $planning): static {
        if ($this->plannings->removeElement($planning)) {
            // set the owning side to null (unless already changed)
            if ($planning->getIlot() === $this) {
                $planning->setIlot(null);
            }
        }
        return $this;
    }

    /**
     * @return Collection<int, Machine>
     */
    public function getMachines(): Collection {
        return $this->machines;
    }

    public function addMachine(Machine $machine): static {
        if (!$this->machines->contains($machine)) {
            $this->machines->add($machine);
            $machine->setIlot($this);
        }
        return $this;
    }

    public function removeMachine(Machine $machine): static {
        if ($this->machines->removeElement($machine)) {
            // set the owning side to null (unless already changed)
            if ($machine->getIlot() === $this) {
                $machine->setIlot(null);
            }
        }
        return $this;
    }

    /**
     * @return Collection<int, IlotEmploye>
     */
    public function getAffectations(): Collection {
        return $this->affectations;
    }

    public function addAffectation(AffectationEmployeIlot $affectation): static {
        if (!$this->affectations->contains($affectation)) {
            $this->affectations->add($affectation);
            $affectation->setIlot($this);
        }
        return $this;
    }

    public function removeAffectation(AffectationEmployeIlot $affectation): static {
        if ($this->affectations->removeElement($affectation)) {
            // set the owning side to null (unless already changed)
            if ($affectation->getIlot() === $this) {
                $affectation->setIlot(null);
            }
        }
        return $this;
    }
}
