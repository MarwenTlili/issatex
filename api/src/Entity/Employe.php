<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\EmployeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EmployeRepository::class)]
#[ApiResource(paginationClientItemsPerPage: true)]
class Employe {
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    #[ORM\Column(type: "integer")]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true, unique: true)]
    private ?string $ref = null;

    #[ORM\Column(length: 255)]
    private ?string $nom = null;

    #[ORM\Column(length: 255)]
    private ?string $prenom = null;

    #[ORM\Column(length: 255)]
    private ?string $poste = null;

    /**
     * @var Collection<int, Presence>
     */
    #[ORM\OneToMany(mappedBy: 'employe', targetEntity: Presence::class, orphanRemoval: true)]
    private Collection $presences;

    /**
     * @var Collection<int, IlotEmploye>
     */
    #[ORM\OneToMany(mappedBy: 'employe', targetEntity: AffectationEmployeIlot::class, orphanRemoval: true)]
    private Collection $affectations;

    public function __construct() {
        $this->presences = new ArrayCollection();
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

    public function getPrenom(): ?string {
        return $this->prenom;
    }

    public function setPrenom(string $prenom): static {
        $this->prenom = $prenom;

        return $this;
    }

    public function getPoste(): ?string {
        return $this->poste;
    }

    public function setPoste(string $poste): static {
        $this->poste = $poste;
        return $this;
    }

    /**
     * @return Collection<int, Presence>
     */
    public function getPresences(): Collection {
        return $this->presences;
    }

    public function addPresence(Presence $presence): static {
        if (!$this->presences->contains($presence)) {
            $this->presences->add($presence);
            $presence->setEmploye($this);
        }
        return $this;
    }

    public function removePresence(Presence $presence): static {
        if ($this->presences->removeElement($presence)) {
            // set the owning side to null (unless already changed)
            if ($presence->getEmploye() === $this) {
                $presence->setEmploye(null);
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
            $affectation->setEmploye($this);
        }
        return $this;
    }

    public function removeAffectation(AffectationEmployeIlot $affectation): static {
        if ($this->affectations->removeElement($affectation)) {
            // set the owning side to null (unless already changed)
            if ($affectation->getEmploye() === $this) {
                $affectation->setEmploye(null);
            }
        }
        return $this;
    }
}
