# Production En Ilot

Objectif: diagramme ERD pour ces fonctionnalités de production en îlot

## Acteurs

### Gérant

-   Génerer les factures
-   prépration des planning de production
-   repartition des Ordres de Fabrication sur des cellules
-   manipulation des Ordres de Fabrication
-   Gérer les clients
-   changer la catégorie de client(privilèger ou non)
-   affecter les machines a un responsale

### Secrétaire

-   suivie production journalier
-   saisie quantité selon qualité et taille
-   saisir le presense des employes
-   établir un bordereau de présence monsuel

### Client

-   lancer ces Ordres de Fabrication
-   lancer des OF habituelle
-   lances des OF urgent
-   supprimer/modifier les OF non lancer
-   recevoir les état des ces OF (notification si OF est lancer/annuler par le gérant)

### magasiner

-   étalit fiche palette

## Fonctionnalités Demandées

-   Prise en Charge des Données de Base (Ilot, Machines, Employés …)
-   Gestion OF (Saisie, Consultations (Liste/Détaillée), MAJ et Suppression)
-   Prise en Charge des OF Urgents (Calcul out Additionnel)
-   Elaboration de Planning du Production (par Ilot).
-   Saisie des Productions Journalières selon les tailles demandées et les qualités (1 ou 2).
-   Clôture de l’of achevé et Préparation des Emballage et expéditions (colis, palettes)
-   Calcul du rendement journalier / hebdomadaire et mensuel de chaque ilot.
-   Gestion des notifications envoyées au client chaque fois que l’OF change d’état.

---

## En Gros

En gros, le nouveau système doit permettre :

-   La création des ilots en leur affectant les machines et un responsable
-   La prise en charge et la planification des différents ordres de fabrication
    lancés par les donneurs d’ordre. Vu l’importance du planning de production
    hebdomadaire qui peut désormais être modifié à tout instant et afin de
    respecter les délais de livraison exigés par les clients et qui sont de plus en
    plus courts, le gérant veut toujours réaliser cette opération par lui-même ;
-   La saisie des quantités fabriquées journalièrement dans les différents ilots
    en termes de quantité et de qualité.
-   le calcul du rendement journalier, hebdomadaire, mensuel et annuel de
    chaque ilot en utilisant la formule suivante :
    Rendement (%) = temps productif / temps de présence

Le temps productif signifie le temps réellement déployé par une équipe
dans la préparation des articles, il peut être déterminé à partir du nombre
d’articles confectionnés et du temps unitaire de l’article estimé par le
donneur d’ordre et corrigé, le cas échéant, par le gérant de la société.
A titre d’exemple, le rendement journalier d’un ilot formée de 5 employés
qui ont travaillé pendant 8 heures et qui ont produit 150 unités de l’article
1 qui nécessite 600 cmn et 200 unités de l’article 2 qui nécessite 500 cmn
est calculé comme suit :  
R = (150 x 6 + 200 x 5) / (5 x 8 x 60) ≈ 79%

---

## ERD (Mon Essai)

### affectation_employe_ilot

-   id (PK)
-   date_debut
-   date_fin
-   est_responsable (boolean)
-   employe_id (FK)
-   ilot_id (FK)

### article

-   id (PK)
-   designation
-   composition
-   client_id (FK)

### client

-   id (PK)
-   nom
-   email
-   adresse
-   privilegie (boolean)

### employe

-   id (PK)
-   nom
-   prenom
-   poste

### ilot

-   id (PK)
-   nom
-   description

### machine

-   id (PK)
-   nom
-   type
-   statut (ACTIF,INACTIF)
-   ilot_id (FK)

### ordre_fabrication

-   id (PK)
-   date_creation
-   date_cloture
-   urgent (boolean)
-   statut (CREE,EN_COURS,TERMINE,ANNULE,EN_ATTENTE)
-   quantite_totale (somme des quantités des tailles (M,L,XL) dans taille_ordre_fabrication)
-   prix_unitaire
-   temps_unitaire (en cmn "centième de minute")
-   client_id (FK)
-   article_id (FK)

### planning

-   id (PK)
-   date_creation (date de creation de plnanning)
-   date_debut (date du debut de planning)
-   date_fin (date du fin de planning)
-   ordre_fabrication_id (FK)
-   ilot_id (FK)

### presence

-   id (PK)
-   date_presence
-   heure_debut
-   heure_fin
-   statut (PRESENT,ABSENT,CONGE,MALADIE,EN_RETARD)
-   temps_presence (nombre d'heures: heure_fin - heure_debut)
-   employe_id (FK)
-   ilot_id (FK)
-   planning_id (FK)

### production

-   id (PK)
-   date_production (jour de production)
-   taille_article (M,L,XL)
-   quantite_premiere_choix
-   quantite_deuxieme_choix
-   quantite_totale (quantite_premiere_choix + quantite_deuxieme_choix)
-   planning_id (FK)

### rendement_quotidien

-   id (PK)
-   nbr_employes
-   nbr_of_traites
-   quantite_totale
-   rendement (%)
-   ilot_id (FK)

### taille_ordre_fabrication

-   id (PK)
-   taille (M,L,XL)
-   quantite
-   ordre_fabrication_id (FK)

---

### palette

-   id (PK)
-   numero
-   date
-   adresse_livraison
-   nombre_colis
-   ordre_fabrication_id (FK)

### colis

-   id (PK)
-   numero
-   quantite_premiere_choix
-   quantite_deuxieme_choix
-   poids_total
-   palette_id (FK)

### notification

-   id (PK)
-   message
-   date_envoi
-   status
-   type
-   ordre_fabrication_id (FK)

---

## Helpers

### Reliquant

```php
$quantiteDemandee = 200;
print("quantite demandée: " . $quantiteDemandee . "<br/>");

$quantiteProduitParJour = intval($quantiteDemandee / 6);
print("quantite produit par jour: " . $quantiteProduitParJour . "<br/>");

$quantiteTotaleProuit = $quantiteProduitParJour * 6;
print("quantite totale produit (6 jours): " . $quantiteTotaleProuit . "<br/>");

$quantiteRestant = $quantiteDemandee - $quantiteTotaleProuit;
print("reliquant: " . $quantiteRestant . "<br/>");

$seuil = $quantiteDemandee*5/100;
print("5% de la quantité commandée : " . $seuil . "<br/>");
```
