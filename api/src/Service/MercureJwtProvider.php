<?php

namespace App\Service;

use ApiPlatform\Metadata\IriConverterInterface;
use App\Entity\User;
use Firebase\JWT\JWT;

class MercureJwtProvider {
  private IriConverterInterface $iriConverter;

  public function __construct(private string $secret, IriConverterInterface $iriConverter) {
    $this->iriConverter = $iriConverter;
  }

  public function createForUser(User $user): string {
    // Get user's IRI dynamically instead of hardcoding "/api/users/{id}"
    $userIri = $this->iriConverter->getIriFromResource($user);

    $payload = [
      "mercure" => [
        "subscribe" => [$userIri],
      ],
      "sub" => (string) $user->getId(),
      // Better be synchronized with the JWT refresh token expirancy
      // see config/packages/gesdinet_jwt_refresh_token.yaml (ttl)
      "exp" => (new \DateTimeImmutable('+7 days'))->getTimestamp(),
    ];

    return JWT::encode($payload, $this->secret, 'HS256');
  }
}
