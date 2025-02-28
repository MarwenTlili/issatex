<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\UserRepository;
use App\State\UserPasswordHasher;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new GetCollection(),
        new Post(processor: UserPasswordHasher::class, validationContext: ['groups' => ['Default', 'user:create']]),
        new Get(),
        new Put(processor: UserPasswordHasher::class),
        new Patch(processor: UserPasswordHasher::class),
        new Delete(),
    ],
    normalizationContext: ['groups' => ['user:read']],
    denormalizationContext: ['groups' => ['user:create', 'user:update']],
    paginationClientItemsPerPage: true
)]
#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER', fields: ['email', 'username'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface {
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "SEQUENCE")]
    #[ORM\Column(type: "integer")]
    private ?int $id = null;

    #[Groups(['user:read'])]
    #[ORM\Column(length: 255, nullable: true, unique: true)]
    private ?string $ref = null;

    #[Assert\NotBlank(groups: ['user:create'])]
    #[Assert\Length(min: 3, max: 30)]
    #[Assert\Regex(
        pattern: "/^[a-zA-Z0-9_]+$/",
        message: "Username can only contain letters, numbers, and underscores."
    )]
    #[Groups(['user:read', 'user:create', 'user:update'])]
    #[ORM\Column(length: 30)]
    private ?string $username = null;

    #[Assert\NotBlank(groups: ['user:create'])]
    #[Assert\Email]
    #[Groups(['user:read', 'user:create', 'user:update'])]
    #[ORM\Column(length: 180, unique: true)]
    private ?string $email = null;

    /**
     * @var string The hashed password
     */
    #[ORM\Column(type: 'string')]
    private ?string $password = null;

    #[Assert\NotBlank(groups: ['user:create'])]
    #[Groups(['user:create', 'user:update'])]
    private ?string $plainPassword = null;

    /**
     * @var list<string> The user roles
     */
    #[Groups(['user:read', 'user:create', 'user:update'])]
    #[ORM\Column(type: 'json')]
    private array $roles = [];

    /**
     * @var Collection<int, Notification>
     */
    #[ORM\OneToMany(mappedBy: 'account', targetEntity: Notification::class, orphanRemoval: true)]
    private Collection $notifications;

    public function __construct() {
        $this->notifications = new ArrayCollection();
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

    public function getUsername(): ?string {
        return $this->username;
    }

    public function setUsername(string $username): static {
        $this->username = $username;

        return $this;
    }

    public function getEmail(): ?string {
        return $this->email;
    }

    public function setEmail(string $email): static {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string {
        return (string) $this->username;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string {
        return $this->password;
    }

    public function setPassword(string $password): static {
        $this->password = $password;

        return $this;
    }

    public function getPlainPassword(): ?string {
        return $this->plainPassword;
    }

    public function setPlainPassword(?string $plainPassword): self {
        $this->plainPassword = $plainPassword;

        return $this;
    }

    /**
     * @see UserInterface
     *
     * @return list<string>
     */
    public function getRoles(): array {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    /**
     * @return Collection<int, Notification>
     */
    public function getNotifications(): Collection {
        return $this->notifications;
    }

    public function addNotification(Notification $notification): static {
        if (!$this->notifications->contains($notification)) {
            $this->notifications->add($notification);
            $notification->setAccount($this);
        }

        return $this;
    }

    public function removeNotification(Notification $notification): static {
        if ($this->notifications->removeElement($notification)) {
            // set the owning side to null (unless already changed)
            if ($notification->getAccount() === $this) {
                $notification->setAccount(null);
            }
        }

        return $this;
    }
}
