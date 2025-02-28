<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Enum\TailleArticle;
use App\Repository\TailleOrdreFabricationRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TailleOrdreFabricationRepository::class)]
#[ApiResource(paginationClientItemsPerPage: true)]
class TailleOrdreFabrication {
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "SEQUENCE")]
    #[ORM\Column(type: "integer")]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true, unique: true)]
    private ?string $ref = null;

    #[ORM\Column(type: Types::STRING, enumType: TailleArticle::class)]
    private ?TailleArticle $tailleArticle;

    #[ORM\Column]
    private ?int $quantite = null;

    #[ORM\ManyToOne(inversedBy: 'taillesOrdreFabrication')]
    #[ORM\JoinColumn(nullable: false)]
    private ?OrdreFabrication $ordreFabrication = null;

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

    public function getTailleArticle(): TailleArticle {
        return $this->tailleArticle;
    }

    public function setTailleArticle(TailleArticle $tailleArticle): self {
        $this->tailleArticle = $tailleArticle;
        return $this;
    }

    public function getQuantite(): ?int {
        return $this->quantite;
    }

    public function setQuantite(int $quantite): static {
        $this->quantite = $quantite;

        return $this;
    }

    public function getOrdreFabrication(): ?OrdreFabrication {
        return $this->ordreFabrication;
    }

    public function setOrdreFabrication(?OrdreFabrication $ordreFabrication): static {
        $this->ordreFabrication = $ordreFabrication;
        return $this;
    }
}
