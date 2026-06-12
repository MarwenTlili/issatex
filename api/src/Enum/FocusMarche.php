<?php

namespace App\Enum;

enum FocusMarche: string {
  case MARCHE_INTERIEUR = "Marché interieur";
  case EXPORTATION_INTERNATIONALE = "Exportation internationale";
  case DURABLE = "Durable";
  case LUXE = "Luxe";
  case MODE_RAPIDE = "Mode rapide";
  case INDUSTRIEL = "Industriel";

  public static function values(): array {
    return array_column(self::cases(), 'value');
  }
}
