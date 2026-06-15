<?php

namespace App\Security;

use App\Entity\User;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAccountStatusException;
use Symfony\Component\Security\Core\User\UserCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class UserChecker implements UserCheckerInterface {
    public function checkPreAuth(UserInterface $user): void {
        if (!$user instanceof User) {
            return;
        }

        if (!$user->isEnabled()) {
            throw new CustomUserMessageAccountStatusException(
                'AccountDisabled',
                code: Response::HTTP_FORBIDDEN
            );
        }
    }

    public function checkPostAuth(UserInterface $user): void {
        // Optional additional checks
    }
}
