<?php

namespace App\Validator;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class UniqueFieldValidator extends ConstraintValidator {
  public function __construct(
    private EntityManagerInterface $entityManager,
  ) {
  }

  public function validate(mixed $value, Constraint $constraint): void {
    if (!$constraint instanceof UniqueField) {
      return;
    }

    if ($value === null || $value === '') {
      return;
    }

    $repository = $this->entityManager->getRepository(
      $constraint->entityClass
    );

    $exists = $repository->findOneBy([
      $constraint->field => $value
    ]);

    if ($exists) {
      $this->context->buildViolation($constraint->message)
        ->addViolation();
    }
  }
}
