<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\Entity\Client;
use App\Entity\User;
use App\Enum\CategoryTextile;
use App\Enum\TailleEntreprise;
use App\Enum\TypeEntreprise;
use App\State\RegisterClientProcessor;
use App\Validator\UniqueField;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/register-client',
            processor: RegisterClientProcessor::class,
        )
    ]
)]
class RegisterClientRequest {
    // --- User Fields ---
    #[Assert\NotBlank]
    #[UniqueField(
        entityClass: User::class,
        field: 'username',
        message: "Ce nom d'utilisateur est déjà utilisé."
    )]
    public string $username = '';

    #[Assert\NotBlank]
    #[Assert\Email]
    #[UniqueField(
        entityClass: User::class,
        field: 'email',
        message: "Cet email est déjà utilisé."
    )]
    public string $email = '';

    #[Assert\NotBlank]
    #[Assert\Length(min: 8)]
    public string $plainPassword = '';

    // --- Client Fields ---
    #[Assert\NotBlank]
    #[UniqueField(
        entityClass: Client::class,
        field: 'nom',
        message: "Cette société existe déjà."
    )]
    public string $nom = '';

    #[Assert\NotBlank]
    public string $prenomResponsable = '';

    #[Assert\NotBlank]
    public string $nomResponsable = '';

    #[Assert\NotBlank]
    public TailleEntreprise $tailleEntreprise;

    #[Assert\NotBlank]
    public TypeEntreprise $typeEntreprise;

    #[Assert\NotBlank]
    public CategoryTextile $categoryTextile;

    #[Assert\NotBlank]
    public string $adresse = '';

    #[Assert\NotBlank]
    public string $ville = '';

    #[Assert\NotBlank]
    public string $codePostal = '';

    #[Assert\NotBlank]
    public string $pays = '';

    #[Assert\NotBlank]
    public string $numeroTelephone = '';

    /** @var string[] */
    #[Assert\NotBlank]
    #[Assert\Count(min: 1)]
    public array $focusMarche = [];

    public ?string $informationsComplementaires = '';
}
