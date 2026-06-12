<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class UniqueField extends Constraint {
  public string $message = 'Cette valeur existe déjà.';

  public function __construct(
    public string $entityClass,
    public string $field,
    ?string $message = null,
    ?array $groups = null,
    mixed $payload = null
  ) {
    parent::__construct([], $groups, $payload);

    if ($message) {
      $this->message = $message;
    }
  }
}
