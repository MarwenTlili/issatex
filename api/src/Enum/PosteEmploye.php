<?php

namespace App\Enum;

enum PosteEmploye: string {
  case TISSEUR = 'Tisseur';
  case FILEUR = 'Fileur';
  case TEINTURIER = 'Teinturier';
  case IMPRIMEUR = 'Imprimeur';
  case COUTURIER = 'Couturier';
  case TAILLEUR = 'Tailleurs';
  case OPERATEUR_DE_MACHINE = 'Opérateur de machine';
}
