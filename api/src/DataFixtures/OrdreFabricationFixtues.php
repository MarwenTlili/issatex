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

    public const OF_0 = "OF_0";
    public const OF_1 = "OF_1";

    public function load(ObjectManager $manager): void {
        $this->faker = Factory::create();

        /** @var Article $article_0 */
        $article_0 = $this->getReference(ArticleFixtures::ARTICLE_0);

        /** @var Article $article_1 */
        $article_1 = $this->getReference(ArticleFixtures::ARTICLE_1);

        $articles = [$article_0, $article_1];

        foreach ($articles as $key => $article) {
            $dateCreation = new \DateTime('-2 weeks');
            // $dateCreation = $this->faker->dateTimeBetween("-3 week", "-1 week");
            $dateCloture = clone $dateCreation;
            $dateCloture->modify('+1 month');

            $random = $this->faker->numberBetween(300, 700);
            $tempsUnitaire = intval(Helper::roundUpToNearest($random, 100));

            $of = new OrdreFabrication();

            $of->setDateCreation($dateCreation)
                ->setDateCloture($dateCloture)
                ->setUrgent(false)
                ->setStatut(StatutOF::CREE)
                ->setQuantiteTotale(0)
                ->setPrixUnitaire(8)
                ->setTempsUnitaire($tempsUnitaire)
                ->setArticle($article)
                ->setClient($article->getClient())
            ;
            $manager->persist($of);

            $referenceName = "OF_" . $key;
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
