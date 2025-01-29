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
R = (150 _ 6 + 200 _ 5) / (5 _ 8 _ 60) ≈ 79%

---

## Examples interfaces

### Saisie OF Urgent

Client: ...
Date OF: ../../.... Ref OF: ...
Ref: Article: .... Désignation: ...
Taille a confecionner:
Taille M .. ,Qte: ..
Taille L: .. ,Qte: ..
Taille XL: .. ,Qte: ..
Quantité Total: ...

Détails OF:
Prix Unitaire Proposé: .. EUR
Temps Unitaire: .. Cmn

### Suivi Rendement Journalier

Date du jour: ../../....

Rendements Ilots

| Code Ilot | Nbr Employés | Nbr OF traités | Quantités Totales | Rendement |
| --------- | ------------ | -------------- | ----------------- | --------- |
| 1         | 4            | 6              | 224               | 67%       |
| 2         | 7            | 5              | 184               | 66%       |
| 3         | 6            | 7              | 250               | 76%       |

Rendement Moyen Atelier: 69.6%

### Modèle de planning de production hebdomadaire

                                                le : ../../….
          Planning de Production de la semaine N° .. / ….
                      Ilot N° : ….

|N° OF|Client|Modèle|Désignation|Composition|Temps Unit (Cmn)|Qte planifié|Qte fabriquée |Observation|
| | | | | | | |1ére choix|2éme choix | |
|-----|------|------|-----------|-----------|----------------|------------|----------------------|-----------|

### Modèle de fiche palette

le : ../../….

Fiche Palette N° ……..

Livraison :(nom et adresse du client) Nbre de colis : ….

|N° Colis|N° OF |Nombre d'articles|Quantité |
| | | |1ére choix|2éme choix|
|--------|------|-----------------|---------------------|

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

### client

-   id (PK)
-   nom
-   email

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
-   quantite_totale
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
-   temps_productif
-   planning_id (FK)

### rendement

-   id (PK)
-   date_calcul (date de calcul de rendement)
-   type_rendement (jour, semaine, mois, annee)
-   rendement_moyen (%)

### rendement_par_ilot

-   id (PK)
-   nombre_employes
-   nombre_of_traites
-   quantite_totale
-   pourcentage_rendement
-   temps_productif
-   temps_presence
-   ilot_id (FK)
-   rendement_id (FK)

### taille_ordre_fabrication

-   id (PK)
-   taille_article (M,L,XL)
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

## Types de machine

Textile machines can be categorized based on their function in the production process. Here are some of the key types:

### 1. Spinning Machines

-   **Ring Spinning Machine**: Traditional spinning method where yarn is created by twisting fibers.
-   **Open-end Spinning Machine**: Uses air to spin fibers into yarn without the need for a spindle.
-   **Air-jet Spinning Machine**: Uses high-pressure air to twist and spin fibers into yarn.
-   **Friction Spinning Machine**: Involves spinning yarn with frictional forces.

### 2. Weaving Machines

-   **Shuttle Loom**: Uses a shuttle to pass the weft yarn through the warp yarn to create the fabric.
-   **Shuttleless Loom**: A more modern loom that doesn’t use a shuttle, - \*\*including:
-   **Air-jet Loom**: Uses air to insert the weft yarn.
-   **Rapier Loom**: Uses a pair of small rapiers to carry the weft yarn.
-   **Projectile Loom**: Uses projectiles to carry the weft yarn through - \*\*the warp.
-   **Gripper Loom**: Uses grippers to hold and insert the weft yarn.

### 3. Knitting Machines

-   **Flat Knitting Machine**: Produces flat knitted fabric, often used for sweaters.
-   **Circular Knitting Machine**: Produces tubular knitted fabric, commonly used for hosiery and seamless garments.

### 4. Finishing Machines

-   **Mercerizing Machine**: Treats cotton fabric with sodium hydroxide to enhance its luster and strength.
-   **Dyeing Machines**: Used to apply color to fabric in various forms such as jet, winch, or jigger dyeing.
-   **Calendering Machine**: Presses fabric to smooth it and give it a glossy finish.

### 5. Carding Machines

-   **Carding Machine**: A key machine in fiber preparation, it separates and cleans fibers, making them ready for spinning.

### 6. Warping Machines

-   **Warping Machine**: Prepares the warp yarns by winding them onto a beam before weaving.

### 7. Textile Printing Machines

-   **Rotary Screen Printing Machine**: Uses cylindrical screens to print fabric continuously.
-   **Flatbed Printing Machine**: Uses flat screens for printing fabric.
-   **Digital Printing Machine**: Uses inkjet technology to print directly onto fabric.

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
