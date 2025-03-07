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
        // $data = $event->getData();
        $user = $event->getUser();

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
