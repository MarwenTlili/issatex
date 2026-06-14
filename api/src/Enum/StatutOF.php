<?php

namespace App\Enum;

enum StatutOF: string {
  case BROUILLON = 'BROUILLON';               // Client created the OF (not yet validated or scheduled)
  case PREVUE = 'PREVUE';           // Admin assigned the OF to a planning slot
  case EN_COURS = 'EN_COURS';   // Production started (date >= planning.dateDebut)
  case COMPLETE = 'COMPLETE';       // Production finished (date >= planning.dateFin)
  case ANNULE = 'ANNULE';         // OF canceled before or during production (with rules)
}
