<?php

namespace App\Serializer;

use App\Entity\Avatar;
use Vich\UploaderBundle\Storage\StorageInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

/**
 * Set the contentUrl property of avatar object
 * - Returning the plain file path on the filesystem where the file is stored 
 * is not useful for the client, which needs a URL to work with
 */
class AvatarNormalizer implements NormalizerInterface {

    private const ALREADY_CALLED = 'AVATAR_NORMALIZER_ALREADY_CALLED';

    public function __construct(
        #[Autowire(service: 'api_platform.jsonld.normalizer.item')]
        private readonly NormalizerInterface $normalizer,
        private readonly StorageInterface $storage,
    ) {
    }

    public function normalize($object, ?string $format = null, array $context = []): array|string|int|float|bool|\ArrayObject|null {
        $context[self::ALREADY_CALLED] = true;

        /** @var Avatar $object */
        $object->setContentUrl($this->storage->resolveUri($object, 'file'));

        return $this->normalizer->normalize($object, $format, $context);
    }

    public function supportsNormalization($data, ?string $format = null, array $context = []): bool {

        if (isset($context[self::ALREADY_CALLED])) {
            return false;
        }

        return $data instanceof Avatar;
    }

    public function getSupportedTypes(?string $format): array {
        return [
            Avatar::class => true,
        ];
    }
}
