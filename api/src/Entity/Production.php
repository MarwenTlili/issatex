<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Enum\TailleArticle;
use App\Repository\ProductionRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProductionRepository::class)]
#[ApiResource(paginationClientItemsPerPage: true)]
class Production {
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    #[ORM\Column(type: "integer")]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true, unique: true)]
    private ?string $ref = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $dateProduction = null;

    #[ORM\Column(type: Types::STRING, enumType: TailleArticle::class)]
    private ?TailleArticle $tailleArticle;

    #[ORM\Column]
    private ?int $quantitePremiereChoix = null;

    #[ORM\Column]
    private ?int $quantiteDeuxiemeChoix = null;

    #[ORM\Column]
    private ?int $quantiteTotale = null;

    #[ORM\ManyToOne(inversedBy: 'productions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Planning $planning = null;

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

    public function getDateProduction(): ?\DateTimeInterface {
        return $this->dateProduction;
    }

    public function setDateProduction(\DateTimeInterface $dateProduction): static {
        $this->dateProduction = $dateProduction;

        return $this;
    }

    function getTailleArticle(): TailleArticle {
        return $this->tailleArticle;
    }

    function setTailleArticle(TailleArticle $tailleArticle): self {
        $this->tailleArticle = $tailleArticle;
        return $this;
    }

    public function getQuantitePremiereChoix(): ?int {
        return $this->quantitePremiereChoix;
    }

    public function setQuantitePremiereChoix(int $quantitePremiereChoix): static {
        $this->quantitePremiereChoix = $quantitePremiereChoix;

        return $this;
    }

    public function getQuantiteDeuxiemeChoix(): ?int {
        return $this->quantiteDeuxiemeChoix;
    }

    public function setQuantiteDeuxiemeChoix(int $quantiteDeuxiemeChoix): static {
        $this->quantiteDeuxiemeChoix = $quantiteDeuxiemeChoix;

        return $this;
    }

    public function getQuantiteTotale(): ?int {
        return $this->quantiteTotale;
    }

    public function setQuantiteTotale(int $quantiteTotale): static {
        $this->quantiteTotale = $quantiteTotale;

        return $this;
    }

    public function getPlanning(): ?Planning {
        return $this->planning;
    }

    public function setPlanning(?Planning $planning): static {
        $this->planning = $planning;
        return $this;
    }
}
