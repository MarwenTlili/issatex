<?php

namespace App\Enum;

enum TailleEntreprise: string {
  case PETITE = "Petite (1-49)";
  case MOYENNE = "Moyenne (50-249)";
  case GRANDE = "Grande (250+)";
}
