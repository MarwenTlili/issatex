<?php

namespace App\EventListener;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationFailureEvent;
use Symfony\Component\Security\Core\User\UserInterface;

class JWTAuthenticationListener {
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager) {
        $this->entityManager = $entityManager;
    }

    /**
     * Handle successful authentication
     */
    public function onAuthenticationSuccess(AuthenticationSuccessEvent $event) {
        // default data: { "token": "..." }
        $data = $event->getData();

        /** @var User */
        $user = $event->getUser();

        $event->setData([
            'access_token' => $data['token'],
            'refresh_token' => '', // Refresh Token will be implemented by "gesdinet/jwt-refresh-token-bundle"
            // see config/packages/lexik_jwt_authentication.yaml
            'expires_in' => 3600, // 3600 = 1 hour, 300 = 5 seccond
            // 'refresh_token_expires_in' => '',
            'token_type' => 'Bearer',
        ]);

        if (!$user instanceof UserInterface) {
            return;
        }

        if ($user instanceof User) {
            $user->setLastLoginAt(new \DateTimeImmutable());

            $this->entityManager->persist($user);
            $this->entityManager->flush();
        }
    }

    /**
     * Handle failed authentication
     */
    public function onAuthenticationFailure(AuthenticationFailureEvent $event) {
        // $exception = $event->getException();
        // $this->logger->warning('Failed login attempt', ['error' => $exception->getMessage()]);
    }
}
