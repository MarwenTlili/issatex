# How To

## Setup

### Build/Rebuild services

```bash
docker compose build --no-cache
```

## Run

### Create and start containers

```bash
docker compose up -d --wait

# connect to postgres
psql -h localhost -U app -d issatex
# OR
docker compose exec -it database bash
psql -U app -d issatex
```

## URLs

| URL                         | Path             | Language   | Description |
| --------------------------- | ---------------- | ---------- | ----------- | ----------- |
| http://localhost:8080/docs/ | api/             | PHP        | The API     |
| http://localhost/           | pwa/             | TypeScript | The Next.js | application |
| http://localhost/admin/     | pwa/pages/admin/ | TypeScript | The Admin   |

## Migration

```bash
php bin/console make:entity

php bin/console make:migration
php bin/console doctrine:migrations:migrate

php bin/console doctrine:schema:validate
```

## Fixtures

```bash
php bin/console doctrine:fixtures:load
```

## Helpers

```bash
# Displays the dumped data in the console
php bin/console server:dump

# Dump the Autoloader:  Sometimes, Composer's autoloader needs a refresh.
composer dump-autoload

# Clears all the cache items in every pool.
php bin/console cache:clear
```

---

est-il une optimization a faire pour facilisé la calcule des rendements (quotidien, hebdomadaire, mentuel, annuel) ?

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
-   temps_productif (quantite_totale \* temps_unitaire)
-   planning_id (FK)

### rendement_quotidien

-   id (PK)
-   nbr_employes
-   quantite_totale
-   rendement (%)
-   ilot_id (FK)

### taille_ordre_fabrication

-   id (PK)
-   taille (M,L,XL)
-   quantite
-   ordre_fabrication_id (FK)

## Symfony Fixtures

```php
class RendementQuotidienFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface {
    public function load(ObjectManager $manager): void {
        /** @var Ilot[] */
        $ilots = [
            $this->getReference(IlotFixtures::ILOT_0),
            $this->getReference(IlotFixtures::ILOT_1),
        ];

        $jour = $ilots[0]->getPlannings()[0]->getDateDebut();

        // ilots
        foreach ($ilots as $ilot) {
            $rendementQuotidien = new RendementQuotidien();
            $rendementQuotidien->setIlot($ilot);

            $quantiteTotale = 0;
            $tempsProduit = 0;
            $tempsPresenceTotale = 0;
            $employesPresents = [];
            $nombreOrdreFabricationTraites = count($ilot->getPlannings());

            // plannings
            foreach ($ilot->getPlannings() as $planning) {
                $ordreFabrication = $planning->getOrdreFabrication();

                // cmn converti en minutes
                $tempsUnitaire = $ordreFabrication->getTempsUnitaire() / 100;

                // production
                foreach ($planning->getProductions() as $production) {
                    if ($production->getDateProduction()->format('Y-m-d') === $jour->format('Y-m-d')) {
                        $quantiteTotale += $production->getQuantiteTotale();
                    }
                }
                $tempsProduit = $quantiteTotale * $tempsUnitaire;

                // presence
                foreach ($planning->getPresences() as $presence) {
                    if (
                        $presence->getDatePresence()->format('Y-m-d') === $jour->format('Y-m-d') &&
                        $presence->getStatut() === StatutPresence::PRESENT
                    ) {
                        $employeId = $presence->getEmploye()->getId();

                        if (!isset($employesPresents[$employeId])) {
                            array_push($employesPresents, $employeId);
                            $tempsPresenceTotale += $presence->getTempsPresence();
                        }
                    }
                }
            }

            $nbrEmployes = count($employesPresents);

            $tempsPresence = $tempsPresenceTotale * 60; // Conversion en minutes

            $rendement = $tempsPresence > 0 ? ($tempsProduit / $tempsPresence) * 100 : 0;

            $rendementQuotidien->setNbrEmployes($nbrEmployes)
                ->setNbrOFTraites($nombreOrdreFabricationTraites)
                ->setQuantiteTotale($quantiteTotale)
                ->setRendement(intval($rendement));

            $manager->persist($rendementQuotidien);
        }

        $manager->flush();
    }

    public function getDependencies() {
        return [
            IlotFixtures::class,
            OrdreFabricationFixtues::class,
            TailleOrdreFabricationFixtures::class,
            PlanningFixtures::class,
            PresenceFixtures::class,
            ProductionFixtures::class
        ];
    }

    public static function getGroups(): array {
        return ['load'];
    }
}
```
