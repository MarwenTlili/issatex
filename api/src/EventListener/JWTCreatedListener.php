<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JWTCreatedListener {
    public function __construct() {
    }

    /**
     * @param JWTCreatedEvent $event
     *
     * @return void
     */
    public function onJWTCreated(JWTCreatedEvent $event) {
        /** @var \App\Entity\User $user */
        $user = $event->getUser();

        /** @var \App\Entity\Avatar */
        $avatar = $user->getAvatar();

        $payload = $event->getData();

        // === Standard / enterprise claims ===
        $payload['iss'] = 'https://localhost';
        $payload['aud'] = 'client-id';
        $payload['sub'] = $user->getId();

        // === Business claims ===
        $payload['username'] = $user->getUsername();
        $payload['email'] = $user->getEmail();
        $payload['roles'] = $user->getRoles();
        $payload['avatar'] = $avatar ? '/uploads/avatars/' . $avatar->getFilePath() : '';

        $event->setData($payload);

        // Optional but recommended
        $header = $event->getHeader();
        $header['cty'] = 'JWT';
        $event->setHeader($header);
    }
}
