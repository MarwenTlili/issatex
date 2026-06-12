<?php

namespace App\Enum;

enum TypeEntreprise: string {
  case MARQUE_DE_MODE = "Marque de mode";
  case CONVERTISSEUR_TEXTILE = "Convertisseur textile";
  case GROSSISTE = "Grossiste";
  case CLIENTELE_CORPORATIVE = "Clientèle corporative";
  case DETAILLANTE = "Détaillante";
  case SOUS_TRAITANT = "Sous-traitant";
  case AUTRE = "Autre ...";
}
