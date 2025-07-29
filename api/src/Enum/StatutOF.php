<?php

namespace App\Enum;

enum StatutOF: string {
  case CREE = 'Cree';
  case PLANIFIE = 'Planifiee';
  case EN_COURS = 'En_cours';
  case TERMINE = 'Terminee';
  case ANNULE = 'Annulee';
}
