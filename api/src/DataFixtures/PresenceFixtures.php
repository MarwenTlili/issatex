<?php

namespace App\DataFixtures;

use App\Entity\Presence;
use App\Entity\Production;
use App\Enum\StatutPresence;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class PresenceFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface {
  protected $faker;

  public function load(ObjectManager $manager): void {
    $this->faker = Factory::create();

    /** @var Production[] */
    $productions = [];

    $i = 0;
    while ($this->hasReference("PRODUCTION_" . $i)) {
      array_push($productions, $this->getReference("PRODUCTION_$i"));
      $i++;
    }

    $j = 0;
    foreach ($productions as $production) {
      $planning = $production->getPlanning();
      $ilot = $planning->getIlot();
      $affectations = $ilot->getAffectations();
      foreach ($affectations as $affectation) {
        // Locale time with timezone
        $heureDebut = \DateTime::createFromFormat("H:i:s", "08:00:00", new \DateTimeZone('Africa/Tunis'));
        // Convert locale time to UTC 
        $heureDebut->setTimezone(new \DateTimeZone('UTC'));

        $heureFin = clone $heureDebut;
        $heureFin->modify("+9 hours");

        // Probabilité de 5 % pour l'absence
        $absent = $this->faker->boolean(5); // 5 % de chance de retourner true

        $presence = new Presence();
        $presence->setDatePresence($production->getDateProduction())
          ->setHeureDebut($heureDebut)
          ->setHeureFin($heureDebut)
          ->setStatut($absent ? StatutPresence::ABSENT : StatutPresence::PRESENT)
          ->setTempsPresence($absent ? 0 : 8)
          ->setEmploye($affectation->getEmploye())
          ->setProduction($production)
        ;

        $manager->persist($presence);
        $this->addReference("PRESENCE_$j", $presence);
        $j++;
      }
    }

    $manager->flush();
  }

  public function getDependencies() {
    return [
      AffectationEmployeIlotFixtures::class,
      ProductionFixtures::class
    ];
  }

  public static function getGroups(): array {
    return ['load'];
  }
}
