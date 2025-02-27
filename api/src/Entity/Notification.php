<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Enum\TypeNotification;
use App\Repository\NotificationRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: NotificationRepository::class)]
#[ApiResource]
class Notification {
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $expediteur = null;

    #[ORM\Column(length: 255)]
    private ?string $titre = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $message = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $dateCreation = null;

    #[ORM\Column]
    private ?bool $lu = null;

    #[ORM\Column(enumType: TypeNotification::class)]
    private ?TypeNotification $type = null;

    #[ORM\ManyToOne(inversedBy: 'notifications')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $account = null;

    public function getId(): ?int {
        return $this->id;
    }

    public function getExpediteur(): ?string {
        return $this->expediteur;
    }

    public function setExpediteur(string $expediteur): static {
        $this->expediteur = $expediteur;

        return $this;
    }

    public function getTitre(): ?string {
        return $this->titre;
    }

    public function setTitre(string $titre): static {
        $this->titre = $titre;

        return $this;
    }

    public function getMessage(): ?string {
        return $this->message;
    }

    public function setMessage(string $message): static {
        $this->message = $message;

        return $this;
    }

    public function getDateCreation(): ?\DateTimeInterface {
        return $this->dateCreation;
    }

    public function setDateCreation(\DateTimeInterface $dateCreation): static {
        $this->dateCreation = $dateCreation;

        return $this;
    }

    public function isLu(): ?bool {
        return $this->lu;
    }

    public function setLu(bool $lu): static {
        $this->lu = $lu;

        return $this;
    }

    public function getType(): ?TypeNotification {
        return $this->type;
    }

    public function setType(TypeNotification $type): static {
        $this->type = $type;

        return $this;
    }

    public function getAccount(): ?User {
        return $this->account;
    }

    public function setAccount(?User $account): static {
        $this->account = $account;

        return $this;
    }
}
