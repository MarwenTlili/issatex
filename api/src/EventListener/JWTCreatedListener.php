<?php

namespace App\EventListener;

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
        /**
         * $event->getData(): ["username" => "...", "roles": [...]]
         */
        /** @var User $user */
        $user = $event->getUser();

        /** @var Avatar */
        $avatar = $user->getAvatar();

        /**
         * [string[] roles, string username]
         * $payload = $event->getData();
         */
        $payload = [];

        $payload['iss'] = 'https://localhost';

        /** add user's ID to toen payload */
        $payload['sub'] = $user->getId();

        $payload['aud'] = 'client-id';

        /** Override token expiration date calculation to be more flexible (defautlt +1 hour) */
        // $expiration = new \DateTime('+1 day');
        // $expiration->setTime(2, 0, 0);
        // $payload['exp'] = $expiration->getTimestamp();

        /** Check lexik_jwt_authentication: token_ttl */
        $expiration = new \DateTime('+1 hour');
        $payload['exp'] = $expiration->getTimestamp(); // Unix TimeStamp (sec)
        // $payload['exp (date)'] = (new \DateTime())->setTimestamp($expiration->getTimestamp())->format('Y-m-d H:i:s');

        /** Token valid only after 60 seconds from now */
        // $payload['nbf'] = time() + 60;

        $now = new \DateTime();
        $payload['iat'] = $now->getTimestamp(); // Unix TimeStamp (sec)
        // $payload['iat (date)'] = (new \DateTime())->setTimestamp($now->getTimestamp())->format('Y-m-d H:i:s');

        /** Add a unique identifier */
        $payload['jti'] = uniqid();

        /** add user's username to token payload */
        $payload['username'] = $user->getUsername();

        $payload['email'] = $user->getEmail();
        $payload['roles'] = $user->getRoles();
        $payload['avatar'] = $avatar ? '/uploads/avatars/' . $avatar->getFilePath() : '';

        /** add client ip address to payload */
        // $request = $this->requestStack->getCurrentRequest();
        // $payload['ip'] = $request->getClientIp();

        $event->setData($payload);

        $header = $event->getHeader();
        $header['cty'] = 'JWT';

        $event->setHeader($header);
    }
}
