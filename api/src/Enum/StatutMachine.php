<?php

namespace App\Enum;

enum StatutMachine: string {
  case AVAILABLE = 'AVAILABLE';
  case UNAVAILABLE = 'UNAVAILABLE';
  case BROKEN = 'BROKEN';
  case MAINTENANCE = 'MAINTENANCE';
}
