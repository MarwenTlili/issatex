<?php

namespace App\DataFixtures;

use App\Entity\Article;
use App\Entity\OrdreFabrication;
use App\Enum\StatutOF;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class OrdreFabricationFixtues extends Fixture implements DependentFixtureInterface, FixtureGroupInterface {
    protected $faker;

    public function load(ObjectManager $manager): void {
        $this->faker = Factory::create();

        /** @var Article[] */
        $articles = [];
        $i = 2;
        while ($this->hasReference("ARTICLE_$i")) {
            $articles[] = $this->getReference("ARTICLE_$i");
            $i++;
        }

        $statuts = StatutOF::cases();

        foreach ($articles as $key => $article) {
            $statut = $statuts[$key % count($statuts)];  // cycle through all the available enum values

            // Choose dateCreation based on status realism
            switch ($statut) {
                case StatutOF::BROUILLON:
                    $dateCreation = $this->faker->dateTimeBetween("-3 days", "now");
                    break;
                case StatutOF::PREVUE:
                    $dateCreation = $this->faker->dateTimeBetween("-3 weeks", "-1 week");
                    break;
                case StatutOF::EN_COURS:
                    $dateCreation = $this->faker->dateTimeBetween("-6 weeks", "-3 weeks");
                    break;
                case StatutOF::COMPLETE:
                    $dateCreation = $this->faker->dateTimeBetween("-2 months", "-1 month");
                    break;
                case StatutOF::ANNULE:
                    $dateCreation = $this->faker->dateTimeBetween("-4 weeks", "-2 days");
                    break;
            }

            $dateCloture  = (clone $dateCreation)->modify('+1 month');

            $random = $this->faker->numberBetween(500, 1500);
            $tempsUnitaire = ceil($random / 1000) * 1000;

            $of = new OrdreFabrication();
            $of->setDateCreation($dateCreation)
                ->setDateCloture($dateCloture)
                ->setUrgent($this->faker->boolean(30))
                ->setStatut($statut)
                ->setQuantiteTotale($this->faker->numberBetween(100, 2500))
                ->setPrixUnitaire("8.00")
                ->setTempsUnitaire($tempsUnitaire)
                ->setArticle($article)
                ->setClient($article->getClient());

            $manager->persist($of);

            $this->addReference("ORDRE_FABRICATION_$key", $of);
        }

        $manager->flush();
    }

    function getDependencies() {
        return  [
            ClientFixtures::class,
            ArticleFixtures::class
        ];
    }

    public static function getGroups(): array {
        return ['load'];
    }
}
