<?php

namespace App\Exception;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Business exception indicating that a user is disabled.
 *
 * This exception will be transformed by API Platform into a response
 * RFC7807 (Problem Details).
 */
final class AccountDisabledException extends HttpException {
  public function __construct(
    string $detail = 'Votre compte est désactivé.',
    ?\Throwable $previous = null,
  ) {
    parent::__construct(Response::HTTP_FORBIDDEN, $detail, $previous);
  }
}
