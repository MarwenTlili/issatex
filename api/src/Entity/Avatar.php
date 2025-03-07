<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\OpenApi\Model\Operation;
use ApiPlatform\OpenApi\Model\RequestBody;
use App\Repository\AvatarRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

#[Vich\Uploadable]
#[ORM\Entity(repositoryClass: AvatarRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['avatar:read']],
    types: ['https://schema.org/MediaObject'],
    outputFormats: ['jsonld' => ['application/ld+json']],
    operations: [
        new Post(
            inputFormats: ['multipart' => ['multipart/form-data']],
            openapi: new Operation(
                requestBody: new RequestBody(
                    content: new \ArrayObject([
                        'multipart/form-data' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'file' => [
                                        'type' => 'string',
                                        'format' => 'binary'
                                    ]
                                ]
                            ]
                        ]
                    ])
                )
            )
        ),
        new Get(),
        new GetCollection(),
        new Delete()
    ]
)]
class Avatar {
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "SEQUENCE")]
    #[ORM\Column(type: "integer")]
    private ?int $id = null;

    #[ApiProperty(types: ['https://schema.org/contentUrl'], writable: false)]
    #[Groups(['avatar:read'])]
    private ?string $contentUrl = null;

    #[Vich\UploadableField(mapping: 'avatars', fileNameProperty: 'filePath')]
    #[Assert\NotNull]
    private ?File $file = null;

    #[ApiProperty(writable: false)]
    #[ORM\Column(nullable: true)]
    private ?string $filePath = null;

    public function getId(): ?int {
        return $this->id;
    }

    public function getContentUrl(): ?string {
        return $this->contentUrl;
    }

    public function setContentUrl(string $contentUrl): self {
        $this->contentUrl = $contentUrl;

        return $this;
    }

    public function getFile(): ?File {
        return $this->file;
    }

    public function setFile(File $file): self {
        $this->file = $file;

        return $this;
    }

    public function getFilePath(): ?string {
        return $this->filePath;
    }

    public function setFilePath(?string $filePath): self {
        $this->filePath = $filePath;

        return $this;
    }
}
