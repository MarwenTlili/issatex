<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use App\Enum\CategoryTextile;
use App\Enum\TailleEntreprise;
use App\Enum\TypeEntreprise;
use App\Repository\ClientRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ClientRepository::class)]
#[ApiResource(paginationClientItemsPerPage: true)]
#[ApiFilter(
    SearchFilter::class,
    properties: [
        "ref" => "ipartial",
        "privilegie" => "exact",
        "account" => "exact"
    ]
)]
#[UniqueEntity(fields: ['nom'])]
class Client {
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    #[ORM\Column(type: "integer")]
    #[Groups(['ordreFabrication:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true, unique: true)]
    #[Groups(['ordreFabrication:read'])]
    private ?string $ref = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Groups(['ordreFabrication:read'])]
    private ?string $nom = null;

    #[ORM\Column(length: 255)]
    private ?string $prenomResponsable = null;

    #[ORM\Column(length: 255)]
    private ?string $nomResponsable = null;

    #[ORM\Column(enumType: TailleEntreprise::class)]
    private ?TailleEntreprise $tailleEntreprise = null;

    #[ORM\Column(enumType: TypeEntreprise::class)]
    private ?TypeEntreprise $typeEntreprise = null;

    #[ORM\Column(enumType: CategoryTextile::class)]
    private ?CategoryTextile $categoryTextile = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['ordreFabrication:read'])]
    private ?string $adresse = null;

    #[ORM\Column(length: 255)]
    private ?string $ville = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $gouvernemental = null;

    #[ORM\Column(length: 255)]
    private ?string $codePostal = null;

    #[ORM\Column(length: 255)]
    private ?string $pays = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $numeroTelephone = null;

    #[ORM\Column(type: 'json')]
    private array $focusMarche = [];

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $informationsComplementaires = null;

    #[ORM\Column(options: ['default' => false])]
    #[Groups(['ordreFabrication:read'])]
    private ?bool $privilegie = false;

    /**
     * @var Collection<int, OrdreFabrication>
     */
    #[ORM\OneToMany(mappedBy: 'client', targetEntity: OrdreFabrication::class, orphanRemoval: true)]
    private Collection $ordreFabrications;

    /**
     * @var Collection<int, Article>
     */
    #[ORM\OneToMany(mappedBy: 'client', targetEntity: Article::class, orphanRemoval: true)]
    private Collection $articles;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?User $account = null;

    public function __construct() {
        $this->ordreFabrications = new ArrayCollection();
        $this->articles = new ArrayCollection();
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

    public function getPrenomResponsable(): ?string {
        return $this->prenomResponsable;
    }

    public function setPrenomResponsable(string $prenomResponsable): static {
        $this->prenomResponsable = $prenomResponsable;

        return $this;
    }

    public function getNomResponsable(): ?string {
        return $this->nomResponsable;
    }

    public function setNomResponsable(string $nomResponsable): static {
        $this->nomResponsable = $nomResponsable;

        return $this;
    }

    public function getTailleEntreprise(): ?TailleEntreprise {
        return $this->tailleEntreprise;
    }

    public function setTailleEntreprise(TailleEntreprise $tailleEntreprise): static {
        $this->tailleEntreprise = $tailleEntreprise;

        return $this;
    }

    public function getTypeEntreprise(): ?TypeEntreprise {
        return $this->typeEntreprise;
    }

    public function setTypeEntreprise(TypeEntreprise $typeEntreprise): static {
        $this->typeEntreprise = $typeEntreprise;

        return $this;
    }

    public function getCategoryTextile(): ?CategoryTextile {
        return $this->categoryTextile;
    }

    public function setCategoryTextile(CategoryTextile $categoryTextile): static {
        $this->categoryTextile = $categoryTextile;

        return $this;
    }

    public function getAdresse(): ?string {
        return $this->adresse;
    }

    public function setAdresse(?string $adresse): static {
        $this->adresse = $adresse;

        return $this;
    }

    public function getVille(): ?string {
        return $this->ville;
    }

    public function setVille(string $ville): static {
        $this->ville = $ville;

        return $this;
    }

    public function getGouvernemental(): ?string {
        return $this->gouvernemental;
    }

    public function setGouvernemental(?string $gouvernemental): static {
        $this->gouvernemental = $gouvernemental;

        return $this;
    }

    public function getCodePostal(): ?string {
        return $this->codePostal;
    }

    public function setCodePostal(string $codePostal): static {
        $this->codePostal = $codePostal;

        return $this;
    }

    public function getPays(): ?string {
        return $this->pays;
    }

    public function setPays(string $pays): static {
        $this->pays = $pays;

        return $this;
    }

    public function getNumeroTelephone(): ?string {
        return $this->numeroTelephone;
    }

    public function setNumeroTelephone(?string $numeroTelephone): static {
        $this->numeroTelephone = $numeroTelephone;

        return $this;
    }

    public function getFocusMarche(): array {
        return $this->focusMarche;
    }

    public function setFocusMarche(array $focusMarche): static {
        $this->focusMarche = $focusMarche;

        return $this;
    }

    public function isPrivilegie(): ?bool {
        return $this->privilegie;
    }

    public function setPrivilegie(bool $privilegie): static {
        $this->privilegie = $privilegie;

        return $this;
    }

    /**
     * @return Collection<int, OrdreFabrication>
     */
    public function getOrdreFabrications(): Collection {
        return $this->ordreFabrications;
    }

    public function addOrdreFabrication(OrdreFabrication $ordreFabrication): static {
        if (!$this->ordreFabrications->contains($ordreFabrication)) {
            $this->ordreFabrications->add($ordreFabrication);
            $ordreFabrication->setClient($this);
        }

        return $this;
    }

    public function removeOrdreFabrication(OrdreFabrication $ordreFabrication): static {
        if ($this->ordreFabrications->removeElement($ordreFabrication)) {
            // set the owning side to null (unless already changed)
            if ($ordreFabrication->getClient() === $this) {
                $ordreFabrication->setClient(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Article>
     */
    public function getArticles(): Collection {
        return $this->articles;
    }

    public function addArticle(Article $article): static {
        if (!$this->articles->contains($article)) {
            $this->articles->add($article);
            $article->setClient($this);
        }

        return $this;
    }

    public function removeArticle(Article $article): static {
        if ($this->articles->removeElement($article)) {
            // set the owning side to null (unless already changed)
            if ($article->getClient() === $this) {
                $article->setClient(null);
            }
        }

        return $this;
    }

    public function getAccount(): ?User {
        return $this->account;
    }

    public function setAccount(User $account): static {
        $this->account = $account;

        return $this;
    }

    public function getInformationsComplementaires(): ?string {
        return $this->informationsComplementaires;
    }

    public function setInformationsComplementaires(?string $informationsComplementaires): static {
        $this->informationsComplementaires = $informationsComplementaires;

        return $this;
    }
}
