<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Enum\StatutOF;
use App\Enum\TailleArticle;
use App\Repository\OrdreFabricationRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: OrdreFabricationRepository::class)]
#[ApiResource(paginationClientItemsPerPage: true)]
class OrdreFabrication {
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    #[ORM\Column(type: "integer")]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true, unique: true)]
    private ?string $ref = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $dateCreation = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $dateCloture = null;

    #[ORM\Column]
    private ?bool $urgent = null;

    #[ORM\Column(type: Types::STRING, enumType: StatutOF::class)]
    private ?StatutOF $statut;

    #[ORM\Column]
    private ?int $quantiteTotale = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    private ?string $prixUnitaire = null;

    #[ORM\Column]
    private ?int $tempsUnitaire = null;

    #[ORM\ManyToOne(inversedBy: 'ordreFabrications')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Client $client = null;

    #[ORM\ManyToOne(inversedBy: 'ordreFabrications')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Article $article = null;

    /**
     * @var Collection<int, TailleOF>
     */
    #[ORM\OneToMany(mappedBy: 'ordreFabrication', targetEntity: TailleOrdreFabrication::class, orphanRemoval: true)]
    private Collection $taillesOrdreFabrication;

    /**
     * @var Collection<int, Planning>
     */
    #[ORM\OneToMany(mappedBy: 'ordreFabrication', targetEntity: Planning::class, orphanRemoval: true)]
    private Collection $plannings;

    public function __construct() {
        $this->taillesOrdreFabrication = new ArrayCollection();
        $this->plannings = new ArrayCollection();
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

    public function getDateCloture(): ?\DateTimeInterface {
        return $this->dateCloture;
    }

    public function setDateCloture(\DateTimeInterface $dateCloture): static {
        $this->dateCloture = $dateCloture;

        return $this;
    }

    public function isUrgent(): ?bool {
        return $this->urgent;
    }

    public function setUrgent(bool $urgent): static {
        $this->urgent = $urgent;
        return $this;
    }

    public function getStatut(): ?StatutOF {
        return $this->statut;
    }

    public function setStatut(StatutOF $statut): self {
        $this->statut = $statut;
        return $this;
    }

    public function getQuantiteTotale(): ?int {
        return $this->quantiteTotale;
    }

    public function setQuantiteTotale(?int $quantiteTotale): static {
        $this->quantiteTotale = $quantiteTotale;

        return $this;
    }

    public function getQuantiteParTaille(TailleArticle $taille): ?int {
        foreach ($this->taillesOrdreFabrication as $tailleOrdreFabrication) {
            if ($tailleOrdreFabrication->getTailleArticle() === $taille) {
                return $tailleOrdreFabrication->getQuantite();
            }
        }

        return null;
    }

    public function getPrixUnitaire(): ?string {
        return $this->prixUnitaire;
    }

    public function setPrixUnitaire(string $prixUnitaire): static {
        $this->prixUnitaire = $prixUnitaire;
        return $this;
    }

    public function getTempsUnitaire(): ?int {
        return $this->tempsUnitaire;
    }

    public function setTempsUnitaire(int $tempsUnitaire): static {
        $this->tempsUnitaire = $tempsUnitaire;
        return $this;
    }

    public function getClient(): ?Client {
        return $this->client;
    }

    public function setClient(?Client $client): static {
        $this->client = $client;
        return $this;
    }

    public function getArticle(): ?Article {
        return $this->article;
    }

    public function setArticle(?Article $article): static {
        $this->article = $article;
        return $this;
    }

    /**
     * @return Collection<int, TailleOF>
     */
    public function getTailleOFs(): Collection {
        return $this->taillesOrdreFabrication;
    }

    public function addTailleOF(TailleOrdreFabrication $tailleOF): static {
        if (!$this->taillesOrdreFabrication->contains($tailleOF)) {
            $this->taillesOrdreFabrication->add($tailleOF);
            $tailleOF->setOrdreFabrication($this);
        }
        return $this;
    }

    public function removeTailleOF(TailleOrdreFabrication $tailleOF): static {
        if ($this->taillesOrdreFabrication->removeElement($tailleOF)) {
            // set the owning side to null (unless already changed)
            if ($tailleOF->getOrdreFabrication() === $this) {
                $tailleOF->setOrdreFabrication(null);
            }
        }
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
            $planning->setOrdreFabrication($this);
        }
        return $this;
    }

    public function removePlanning(Planning $planning): static {
        if ($this->plannings->removeElement($planning)) {
            // set the owning side to null (unless already changed)
            if ($planning->getOrdreFabrication() === $this) {
                $planning->setOrdreFabrication(null);
            }
        }
        return $this;
    }
}
