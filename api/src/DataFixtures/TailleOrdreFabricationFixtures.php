<?php

namespace App\DataFixtures;

use App\Entity\TailleOrdreFabrication;
use App\Enum\TailleArticle;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class TailleOrdreFabricationFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface {
    protected $faker;

    public const TAILLE_ORDRE_FABRICATION_0_L = "TAILLE_ORDRE_FABRICATION_0_L";
    public const TAILLE_ORDRE_FABRICATION_0_M = "TAILLE_ORDRE_FABRICATION_0_M";
    public const TAILLE_ORDRE_FABRICATION_0_XL = "TAILLE_ORDRE_FABRICATION_0_XL";

    public const TAILLE_ORDRE_FABRICATION_1_L = "TAILLE_ORDRE_FABRICATION_1_L";
    public const TAILLE_ORDRE_FABRICATION_1_M = "TAILLE_ORDRE_FABRICATION_1_M";
    public const TAILLE_ORDRE_FABRICATION_1_XL = "TAILLE_ORDRE_FABRICATION_1_XL";

    public function load(ObjectManager $manager): void {
        $this->faker = Factory::create();
        $taillesArticle = [TailleArticle::L, TailleArticle::M, TailleArticle::XL];

        /** @var OrdreFabrication $of0|null */
        $of0 = $this->getReference(OrdreFabricationFixtues::OF_0);

        /** @var OrdreFabrication $of2|null */
        $of1 = $this->getReference(OrdreFabricationFixtues::OF_1);

        $ofs = [$of0, $of1];

        $ordreFabricationQuantities = [];

        foreach ($ofs as $key => $of) {
            // Track total quantities per OF
            $ordreFabricationQuantities[spl_object_id($of)] = 0;
            foreach ($taillesArticle as $tailleArticle) {
                $random = $this->faker->numberBetween(100, 600);
                $quantite = intval(Helper::roundUpToNearest($random, 100));

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

        // Update quantiteTotale for each OrdreFabrication
        foreach ($ofs as $of) {
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
