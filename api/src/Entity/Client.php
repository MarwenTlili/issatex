<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ClientRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ClientRepository::class)]
#[ApiResource(paginationClientItemsPerPage: true)]
class Client {
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    #[ORM\Column(type: "integer")]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true, unique: true)]
    private ?string $ref = null;

    #[ORM\Column(length: 255, unique: true)]
    private ?string $nom = null;

    #[ORM\Column(length: 255, unique: true)]
    private ?string $email = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $adresse = null;

    #[ORM\Column]
    private ?bool $privilegie = null;

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

    public function getEmail(): ?string {
        return $this->email;
    }

    public function setEmail(string $email): static {
        $this->email = $email;

        return $this;
    }

    public function getAdresse(): ?string {
        return $this->adresse;
    }

    public function setAdresse(?string $adresse): static {
        $this->adresse = $adresse;

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
    public function getArticles(): Collection
    {
        return $this->articles;
    }

    public function addArticle(Article $article): static
    {
        if (!$this->articles->contains($article)) {
            $this->articles->add($article);
            $article->setClient($this);
        }

        return $this;
    }

    public function removeArticle(Article $article): static
    {
        if ($this->articles->removeElement($article)) {
            // set the owning side to null (unless already changed)
            if ($article->getClient() === $this) {
                $article->setClient(null);
            }
        }

        return $this;
    }
}
