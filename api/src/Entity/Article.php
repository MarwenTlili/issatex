<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\ExistsFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use App\Repository\ArticleRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Filter\WithoutOrdreFabricationFilter;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ArticleRepository::class)]
#[ApiResource(
    mercure: true,
    paginationClientItemsPerPage: true,
    operations: [
        new Post(),
        new Get(),
        new GetCollection(),
        new Patch(),
        new Delete()
    ]
)]
#[ApiFilter(
    SearchFilter::class,
    properties: [
        "ref" => "ipartial",
        "designation" => "ipartial",
        "client" => "exact",
    ]
)]
#[ApiFilter(OrderFilter::class, properties: ["ref", "designation"])]
#[ApiFilter(WithoutOrdreFabricationFilter::class)]
class Article {
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "SEQUENCE")]
    #[ORM\Column(type: "integer")]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true, unique: true)]
    private ?string $ref = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Assert\NotBlank]
    private ?string $designation = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Assert\NotBlank]
    private ?string $composition = null;

    #[ORM\ManyToOne(inversedBy: 'articles')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Client $client = null;

    /**
     * @var Collection<int, OrdreFabrication>
     */
    #[ORM\OneToMany(mappedBy: 'article', targetEntity: OrdreFabrication::class, orphanRemoval: true)]
    private Collection $ordreFabrications;

    public function __construct() {
        $this->ordreFabrications = new ArrayCollection();
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

    public function getDesignation(): ?string {
        return $this->designation;
    }

    public function setDesignation(string $designation): static {
        $this->designation = $designation;
        return $this;
    }

    public function getComposition(): ?string {
        return $this->composition;
    }

    public function setComposition(?string $composition): static {
        $this->composition = $composition;
        return $this;
    }


    public function getClient(): ?Client {
        return $this->client;
    }

    public function setClient(?Client $client): static {
        $this->client = $client;

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
            $ordreFabrication->setArticle($this);
        }
        return $this;
    }

    public function removeOrdreFabrication(OrdreFabrication $ordreFabrication): static {
        if ($this->ordreFabrications->removeElement($ordreFabrication)) {
            // set the owning side to null (unless already changed)
            if ($ordreFabrication->getArticle() === $this) {
                $ordreFabrication->setArticle(null);
            }
        }
        return $this;
    }
}
