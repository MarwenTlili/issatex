<?php

namespace App\DataFixtures;

use App\Entity\Article;
use App\Entity\Client;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class ArticleFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface {
    protected $faker;

    public const ARTICLE_0 = "ARTICLE_0";
    public const ARTICLE_1 = "ARTICLE_1";

    public function load(ObjectManager $manager): void {
        $this->faker = Factory::create();

        /** @var Client $client_0 */
        $client_0 = $this->getReference(ClientFixtures::CLIENT_0);

        /** @var Client $client_1 */
        $client_1 = $this->getReference(ClientFixtures::CLIENT_1);

        $clients = [$client_0, $client_1];

        foreach ($clients as $key => $client) {
            $article = new Article();
            $article->setDesignation($this->faker->unique()->sentence(3))
                ->setComposition($this->faker->text())
                ->setClient($client)
            ;

            $manager->persist($article);

            // Add references for each article
            $referenceName = "ARTICLE_" . $key;
            $this->addReference($referenceName, $article);
        }

        $manager->flush();
    }

    public function getDependencies() {
        return [
            ClientFixtures::class
        ];
    }

    public static function getGroups(): array {
        return ['load'];
    }
}
