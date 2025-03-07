<?php

namespace App\EventListener;

use App\Entity\Avatar;
use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\HttpFoundation\RequestStack;

class JWTCreatedListener {
    /**
     * @var RequestStack
     */
    private $requestStack;

    /**
     * @param RequestStack $requestStack
     */
    public function __construct(RequestStack $requestStack) {
        $this->requestStack = $requestStack;
    }

    /**
     * @param JWTCreatedEvent $event
     *
     * @return void
     */
    public function onJWTCreated(JWTCreatedEvent $event) {
        $request = $this->requestStack->getCurrentRequest();

        /** @var User $user */
        $user = $event->getUser();

        /**
         * [string[] roles, string username]
         * $payload = $event->getData();
         */
        $payload = [];

        // add user's ID to toen payload
        $payload['sub'] = $user->getId();

        $now = new \DateTime();
        $payload['iat'] = $now->getTimestamp();

        // Override token expiration date calculation to be more flexible (defautlt +1 hour)
        $expiration = new \DateTime('+1 day');
        $expiration->setTime(2, 0, 0);
        $payload['exp'] = $expiration->getTimestamp();

        // add user's username to token payload
        $payload['username'] = $user->getUsername();

        // add user's email to token payload
        $payload['email'] = $user->getEmail();

        // add roles to token payload
        $payload['roles'] = $user->getRoles();

        // add avatar's filePath to payload
        /** @var Avatar */
        $avatar = $user->getAvatar();
        $payload['avatar'] = $avatar ? '/uploads/avatars/' . $avatar->getFilePath() : null;

        // add client ip address to payload
        $payload['ip'] = $request->getClientIp();

        $event->setData($payload);

        $header = $event->getHeader();
        $header['cty'] = 'JWT';

        $event->setHeader($header);
    }
}
