<?php

namespace App\DataFixtures;

use App\Entity\OrdreFabrication;
use App\Entity\TailleOrdreFabrication;
use App\Enum\TailleArticle;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class TailleOrdreFabricationFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface {
    protected $faker;

    public function load(ObjectManager $manager): void {
        $this->faker = Factory::create();

        /** @var OrdreFabrication[] */
        $ordreFabrications = [];
        $i = 0;
        while ($this->hasReference("ORDRE_FABRICATION_$i")) {
            array_push($ordreFabrications, $this->getReference("ORDRE_FABRICATION_$i"));
            $i++;
        }

        $ordreFabricationQuantities = [];

        foreach ($ordreFabrications as $key => $of) {
            // Suivi des quantités totales par ordre de fabrication
            $ordreFabricationQuantities[spl_object_id($of)] = 0;
            foreach (TailleArticle::cases() as $tailleArticle) {
                $random = $this->faker->numberBetween(200, 400);
                $quantite = ceil($random / 100) * 100;

                $taille = new TailleOrdreFabrication();
                $taille->setTailleArticle($tailleArticle)
                    ->setQuantite($quantite)
                    ->setOrdreFabrication($of);

                $ordreFabricationQuantities[spl_object_id($of)] += $quantite;

                $manager->persist($taille);

                $referenceName = "TAILLE_ORDRE_FABRICATION_" . $key . "_" . $tailleArticle->value;
                $this->addReference($referenceName, $taille);
            }
        }
        $manager->flush();

        // Mise à jour de la quantite totale pour chaque ordre de fabrication
        foreach ($ordreFabrications as $of) {
            $of->setQuantiteTotale($ordreFabricationQuantities[spl_object_id($of)]);
            $manager->persist($of);
        }
        $manager->flush();
    }

    public function getDependencies() {
        return [
            OrdreFabricationFixtues::class,
        ];
    }

    public static function getGroups(): array {
        return ['load'];
    }
}
