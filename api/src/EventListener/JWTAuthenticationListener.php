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

    public function __construct(
        EntityManagerInterface $entityManager,
        MercureJwtProvider $mercureJwtProvider
    ) {
        $this->entityManager = $entityManager;
        $this->mercureJwtProvider = $mercureJwtProvider;
    }

    /**
     * Handle successful authentication
     */
    public function onAuthenticationSuccess(AuthenticationSuccessEvent $event) {
        /** @var User */
        $user = $event->getUser();

        // default data: { "token": "..." }
        $data = $event->getData();

        if (!$user instanceof UserInterface) {
            return;
        }

        // Base response payload
        $payload = [
            'access_token' => $data['token'],
            'refresh_token' => '', // handled by gesdinet/jwt-refresh-token-bundle
            'expires_in' => 3600, // seconds
            'token_type' => 'Bearer',
        ];

        // Add Mercure token for private subscriptions
        if ($user instanceof User) {
            $payload['mercureJwt'] = $this->mercureJwtProvider->createForUser($user);

            // Optionally update last login timestamp
            $user->setLastLoginAt(new \DateTimeImmutable());
            $this->entityManager->persist($user);
            $this->entityManager->flush();
        }

        // Update the final login response
        $event->setData($payload);
    }

    /**
     * Handle failed authentication
     */
    public function onAuthenticationFailure(AuthenticationFailureEvent $event) {
        // $exception = $event->getException();
        // $this->logger->warning('Failed login attempt', ['error' => $exception->getMessage()]);
    }
}
