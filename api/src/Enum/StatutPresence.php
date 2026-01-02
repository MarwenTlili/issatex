<?php

namespace App\Enum;

enum StatutPresence: string {
  case PRESENT = 'Present';
  case ABSENT = 'Absent';
  case RETARD = 'Retard';
  case CONGE = 'Conge';
}
