<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Client;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class RegisterClientProcessor implements ProcessorInterface {
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher
    ) {
    }

    public function process(
        mixed $data,
        Operation $operation,
        array $uriVariables = [],
        array $context = []
    ): object {
        // 1. Wrap operations inside a transaction for complete atomicity
        return $this->entityManager->wrapInTransaction(function () use ($data) {
            // 2. Instantiate and fill User Entity
            $user = new User();
            $user->setEmail($data->email);
            $user->setUsername($data->username);
            $user->setRoles(['ROLE_CLIENT']);
            $user->setEnabled(false);

            // Hash the password cleanly
            $hashedPassword = $this->passwordHasher->hashPassword($user, $data->plainPassword);
            $user->setPassword($hashedPassword);

            $this->entityManager->persist($user);

            // 3. Instantiate and fill Client Entity
            $client = new Client();
            $client->setNom($data->nom);
            $client->setPrenomResponsable($data->prenomResponsable);
            $client->setNomResponsable($data->nomResponsable);
            $client->setTailleEntreprise($data->tailleEntreprise);
            $client->setTypeEntreprise($data->typeEntreprise);
            $client->setCategoryTextile($data->categoryTextile);
            $client->setAdresse($data->adresse);
            $client->setVille($data->ville);
            $client->setCodePostal($data->codePostal);
            $client->setPays($data->pays);
            $client->setNumeroTelephone($data->numeroTelephone);
            $client->setFocusMarche($data->focusMarche);
            $client->setInformationsComplementaires($data->informationsComplementaires);
            $client->setPrivilegie(false);

            // Link the relations
            $client->setAccount($user);

            $this->entityManager->persist($client);

            // 4. Commit both cleanly to the Database simultaneously
            try {
                $this->entityManager->flush();
            } catch (\Throwable $th) {
                throw new BadRequestHttpException("Duplicate value detected.");
            }

            // Return custom clean data mapping back to front-end
            return new JsonResponse([
                'success' => true,
                'message' => "Inscription réussie !",
                'userId'  => $user->getId(),
                'clientId' => $client->getId()
            ]);
        });
    }
}
