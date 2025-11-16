<?php

namespace App\Enum;

enum StatutOF: string {
  case DRAFT = 'DRAFT';               // Client created the OF (not yet validated or scheduled)
  case PLANNED = 'PLANNED';           // Admin assigned the OF to a planning slot
  case IN_PROGRESS = 'IN_PROGRESS';   // Production started (date >= planning.dateDebut)
  case COMPLETED = 'COMPLETED';       // Production finished (date >= planning.dateFin)
  case CANCELED = 'CANCELED';         // OF canceled before or during production (with rules)
}
