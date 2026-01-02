<?php

namespace App\Enum;

enum TypeRendement: string {
  case JOUR = "jour";
  case SEMAINE = "Semaine";
  case MOIS = "Mois";
  case ANNEE = "Annee";
}
