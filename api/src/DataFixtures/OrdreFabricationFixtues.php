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
        $this->faker->seed(random_int(1, 999999));

        /** @var Article[] */
        $articles = [];
        $i = 2;
        while ($this->hasReference("ARTICLE_$i")) {
            array_push($articles, $this->getReference("ARTICLE_$i"));
            $i++;
        }

        foreach ($articles as $key => $article) {
            // $dateCreation = new \DateTime('-2 weeks');
            $dateCreation = $this->faker->unique()->dateTimeBetween("-4 week", "-1 week");

            // 2 première of dans la même semaine
            // $dateCreation = $key < 2
            //     ? new \DateTime('-3 weeks')
            //     : $this->faker->dateTimeBetween("-2 week", "-1 week");

            $dateCloture = clone $dateCreation;
            $dateCloture->modify('+1 month');

            $random = $this->faker->numberBetween(500, 1500);
            $tempsUnitaire = ceil($random / 1000) * 1000;

            $of = new OrdreFabrication();

            $of->setDateCreation($dateCreation)
                ->setDateCloture($dateCloture)
                ->setUrgent($this->faker->boolean(50))
                ->setStatut(StatutOF::CREE)
                ->setQuantiteTotale(0)
                ->setPrixUnitaire(8)
                ->setTempsUnitaire($tempsUnitaire)
                ->setLance(false)
                ->setArticle($article)
                ->setClient($article->getClient())
            ;
            $manager->persist($of);

            $referenceName = "ORDRE_FABRICATION_" . $key;
            $this->addReference($referenceName, $of);
        }

        $manager->flush();
    }

    function getDependencies() {
        return  [
            ArticleFixtures::class,
            ClientFixtures::class
        ];
    }

    public static function getGroups(): array {
        return ['load'];
    }
}
