<?php

namespace App\Controller;

use App\Entity\Avatar;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

/**
 * Provides user's informations
 * - The client (eg: brower) must provide his token in headers 
 * when requesting this resource.
 */
#[AsController]
class Profile extends AbstractController {
    #[Route(
        name: 'api_profile',
        path: '/api/profile',
        methods: ['GET']
    )]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function __invoke(Security $security) {
        /** @var User */
        $user = $security->getUser();

        /** @var Avatar */
        $avatar = $user->getAvatar();

        return new JsonResponse([
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
            'image' => $avatar ? '/uploads/avatars/' . $avatar->getFilePath() : ''
        ]);
    }
}
