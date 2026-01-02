<?php

namespace App\EventListener;

use App\Entity\User;
use App\Service\MercureJwtProvider;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationFailureEvent;
use Symfony\Component\Security\Core\User\UserInterface;

class JWTAuthenticationListener {
    private EntityManagerInterface $entityManager;
    private MercureJwtProvider $mercureJwtProvider;
    private int $accessTokenTtl;

    public function __construct(
        EntityManagerInterface $entityManager,
        MercureJwtProvider $mercureJwtProvider,
        int $accessTokenTtl
    ) {
        $this->entityManager = $entityManager;
        $this->mercureJwtProvider = $mercureJwtProvider;
        $this->accessTokenTtl = $accessTokenTtl;
    }

    /**
     * Handle successful authentication
     */
    public function onAuthenticationSuccess(AuthenticationSuccessEvent $event) {
        /** @var User */
        $user = $event->getUser();

        $data = $event->getData();

        if (!$user instanceof UserInterface) {
            return;
        }

        // Authentication response body (HTTP / API contract)
        $response = [
            'token_type' => 'Bearer',
            'expires_in' => $this->accessTokenTtl, // in seconds
            'access_token' => $data['token'],
            'refresh_token' => '', // handled by gesdinet/jwt-refresh-token-bundle
        ];

        // Add Mercure token for private subscriptions
        if ($user instanceof User) {
            $response['mercureJwt'] = $this->mercureJwtProvider->createForUser($user);

            // Optionally update last login timestamp
            $user->setLastLoginAt(new \DateTimeImmutable());
            $this->entityManager->persist($user);
            $this->entityManager->flush();
        }

        // Update the final login response
        $event->setData($response);
    }

    /**
     * Handle failed authentication
     */
    public function onAuthenticationFailure(AuthenticationFailureEvent $event) {
        // $exception = $event->getException();
        // $this->logger->warning('Failed login attempt', ['error' => $exception->getMessage()]);
    }
}
