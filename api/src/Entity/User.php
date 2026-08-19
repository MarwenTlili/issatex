<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\UserRepository;
use App\State\UserPasswordHasher;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

#[Vich\Uploadable]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    normalizationContext: ['groups' => ['user:read']],
    denormalizationContext: ['groups' => ['user:create', 'user:update']],
    paginationClientItemsPerPage: true,
    operations: [
        new Post(
            processor: UserPasswordHasher::class,
            validationContext: ['groups' => ['Default', 'user:create']],
        ),
        new GetCollection(),
        new Get(),
        new Patch(
            processor: UserPasswordHasher::class,
        ),
        new Delete(),
    ],
    order: ['createdAt' => 'DESC']
)]
#[ApiFilter(OrderFilter::class, properties: ['createdAt'])]
#[ApiFilter(SearchFilter::class, properties: [
    'id' => 'exact',
    'ref' => 'partial',
    'username' => 'partial',
    'email' => 'partial'
])]
#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[UniqueEntity(fields: ['username'])]
#[UniqueEntity(fields: ['email'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface {
    /**
     * Match format only, delegate length validation to Assert\Length
     */
    public const USERNAME_REGEX = '/^[a-z0-9_]+$/';

    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "SEQUENCE")]
    #[ORM\Column(type: "integer")]
    #[Groups(['user:read'])]
    private ?int $id = null;

    #[Groups(['user:read'])]
    #[ORM\Column(length: 255, nullable: true, unique: true)]
    private ?string $ref = null;

    #[Assert\NotBlank(groups: ['user:create'])]
    #[Assert\Length(min: 3, max: 30, groups: ['user:create', 'user:update'])]
    #[Groups(['user:read', 'user:create', 'user:update'])]
    #[ORM\Column(length: 30, unique: true)]
    #[Assert\Regex(
        pattern: self::USERNAME_REGEX,
        message: "Le nom d'utilisateur ne peut contenir que des lettres minuscules, chiffres et underscores (_).",
        groups: ['user:create', 'user:update']
    )]
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
    #[Assert\Length(
        min: 8,
        max: 4096,
        minMessage: "Le mot de passe doit contenir au moins 8 caractères.",
        maxMessage: "Le mot de passe est trop long.",
        groups: ['user:create']
    )]
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

    #[ApiProperty(types: ['https://schema.org/image'])]
    #[Groups(['user:read', 'user:create', 'user:update'])]
    #[ORM\OneToOne(cascade: ['persist', 'remove'], orphanRemoval: true)]
    private ?Avatar $avatar = null;

    #[Groups(['user:read', 'user:create', 'user:update'])]
    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $createdAt = null;

    #[Groups(['user:read', 'user:create', 'user:update'])]
    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $lastLoginAt = null;

    #[Groups(['user:read', 'user:create', 'user:update'])]
    #[ORM\Column(nullable: true)]
    private ?bool $enabled = null;

    public function __construct() {
        $this->notifications = new ArrayCollection();
    }

    #[ORM\PrePersist]
    public function setPrePersistValues(): void {
        $this->createdAt = new \DateTimeImmutable();
        $this->lastLoginAt = new \DateTimeImmutable();
        if ($this->isEnabled() === null) {
            $this->setEnabled(false);
        }
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
        $this->username = $username !== null
            ? mb_strtolower(trim($username))
            : null;

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

    public function getAvatar(): ?Avatar {
        return $this->avatar;
    }

    public function setAvatar(?Avatar $avatar): static {
        $this->avatar = $avatar;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getLastLoginAt(): ?\DateTimeImmutable {
        return $this->lastLoginAt;
    }

    public function setLastLoginAt(?\DateTimeImmutable $lastLoginAt): self {
        $this->lastLoginAt = $lastLoginAt;

        return $this;
    }

    public function isEnabled(): ?bool {
        return $this->enabled;
    }

    public function setEnabled(?bool $enabled): self {
        $this->enabled = $enabled;

        return $this;
    }
}
