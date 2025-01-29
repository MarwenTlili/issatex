<?php

namespace App\Enum;

enum StatutMachine: string {
  case FONCTIONNELLE = 'Fonctionnelle';
  case EN_PANNE = 'En Panne';
  case EN_MAINTENANCE = 'En Maintenance';
  case EN_ARRETEE = 'En Arretee';
  case EN_COURS_DE_REPARATION = 'En Cours De Reparation';
  case DISPONIBLE = 'Disponible';
  case INDISPONIBLE = 'Indisponible';
}
