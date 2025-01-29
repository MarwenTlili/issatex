<?php

namespace App\Enum;

enum StatutOF: string {
  case CREE = 'Cree';
  case EN_COURS = 'En_cours';
  case TERMINE = 'Terminee';
  case ANNULE = 'Annule';
  case EN_ATTENTE = 'En_attente';
}
