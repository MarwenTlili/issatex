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

    public function load(ObjectManager $manager): void {
        $this->faker = Factory::create();

        /** @var Client[] */
        $clients = [];
        $c = 2;
        while ($this->hasReference("CLIENT_$c")) {
            array_push($clients, $this->getReference("CLIENT_$c"));
            $c++;
        }

        $clientCount = count($clients);

        /**
         * The reference for the client that owns the article (product) starts from 2, eg. CLIENT_2, ...
         * objective: create 5 articles to cover the 5 statuses of the manufacturing orders
         */
        for ($i = 2; $i < 7; $i++) {
            $article = new Article();
            $article->setDesignation($this->faker->unique()->sentence(3))
                ->setComposition($this->faker->text())
                ->setClient($clients[$i % $clientCount]) // round-robin
            ;
            $manager->persist($article);
            $this->addReference("ARTICLE_" . $i, $article);
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
