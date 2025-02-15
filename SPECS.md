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

## ERD (Essai)

### employe

-   id (PK)
-   ref (UNIQUE)
-   nom
-   prenom
-   poste (enum PosteEmploye)

### ilot

-   id (PK)
-   ref (UNIQUE)
-   nom
-   description

### machine

-   id (PK)
-   ref (UNIQUE)
-   nom
-   type
-   statut (enum StatutMachine)
-   ilot_id (FK ManyToOne ilot)

### affectation_employe_ilot

-   id (PK)
-   ref (UNIQUE)
-   date_debut
-   date_fin
-   responsable (BOOLEAN)
-   employe_id (FK ManyToOne employe)
-   ilot_id (FK ManyToOne ilot)

### client

-   id (PK)
-   ref (UNIQUE)
-   nom
-   email
-   adresse
-   privilegie (BOOLEAN)

### article

-   id (PK)
-   ref (UNIQUE)
-   designation
-   composition
-   client_id (FK ManyToOne client)

### ordre_fabrication

-   id (PK)
-   ref (UNIQUE)
-   date_creation
-   date_cloture
-   urgent (BOOLEAN)
-   statut (enum StatutOF)
-   quantite_totale (somme des taille_ordre_fabrication.quantite)
-   prix_unitaire (DECIMAL(10,2))
-   temps_unitaire (en cmn "centième de minute")
-   client_id (FK ManyToOne client)
-   article_id (FK ManyToOne article)

### taille_ordre_fabrication

-   id (PK)
-   ref (UNIQUE)
-   taille (enum TailleArticle)
-   quantite
-   ordre_fabrication_id (FK ManyToOne ordre_fabrication)

### planning

-   id (PK)
-   ref (UNIQUE)
-   date_creation (date de creation de plnanning)
-   date_debut (date du debut de planning)
-   date_fin (date du fin de planning)
-   reporte (BOOLEAN, selon le reliquat)
-   ordre_fabrication_id (FK ManyToOne ordre_fabrication)
-   ilot_id (FK ManyToOne ilot)

### production

-   id (PK)
-   ref (UNIQUE)
-   date_production (jour de production)
-   taille_article (enum TailleArticle)
-   quantite_premiere_choix
-   quantite_deuxieme_choix
-   quantite_totale (quantite_premiere_choix + quantite_deuxieme_choix)
-   planning_id (FK ManyToOne planning)

### presence

-   id (PK)
-   ref (UNIQUE)
-   date_presence
-   heure_debut
-   heure_fin
-   statut (enum StatutPresence)
-   temps_presence (nombre d'heures: heure_fin - heure_debut)
-   employe_id (FK ManyToOne employe)
-   production_id (FK ManyToOne production)

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

### Quantités de production

```php
$x = 1211;
printf("ceil($x / 100) * 100: %d <br/>", ceil($x / 100) * 100);

$quantiteParJour = intval($x / 6);
printf("quantiteParJour: %d <br/>", (int)$quantiteParJour);

$quantitePremiereChoix = rand($quantiteParJour - 10, $quantiteParJour);
printf("quantitePremiereChoix: %d </br>", $quantitePremiereChoix);

$quantiteDeuxiemeChoix = rand(1, 5);
printf("quantiteDeuxiemeChoix: %d", $quantiteDeuxiemeChoix);
```

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
