<?php

namespace App\DataFixtures;

use App\Entity\Planning;
use App\Entity\Presence;
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

    /** @var AffectationEmployeIlot[] $affectations */
    $affectations = [];
    $i = 0;
    while ($this->hasReference("AFFECTATION_$i")) {
      $affectations[] = $this->getReference("AFFECTATION_$i");
      $i++;
    }

    /** @var Planning[] $plannings */
    $plannings = [];
    $j = 0;
    while ($this->hasReference("PLANNING_$j")) {
      $plannings[] = $this->getReference("PLANNING_$j");
      $j++;
    }

    $refCounter = 0;

    foreach ($affectations as $affectation) {
      $employe = $affectation->getEmploye();
      $ilot = $affectation->getIlot();

      // collect all planning days for this ilot
      $days = [];
      foreach ($plannings as $planning) {
        if ($planning->getIlot() === $ilot) {
          $currentDate = clone $planning->getDateDebut();
          $periodEnd   = $planning->getDateFin();

          while ($currentDate <= $periodEnd) {
            $dayOfWeek = (int)$currentDate->format('N'); // 1=Mon, 7=Sun
            if ($dayOfWeek < 7) { // Monday–Saturday only
              $days[$currentDate->format('Y-m-d')] = clone $currentDate;
            }
            $currentDate->modify('+1 day');
          }
        }
      }

      // generate presences only once per day
      foreach ($days as $dateStr => $datePresence) {
        $presence = new Presence();

        $heureDebut = (clone $datePresence)->setTime(8, 0, 0);
        $heureFin   = (clone $datePresence)->setTime(16, 0, 0);

        // Bias random status: 90% PRESENT, 5% ABSENT, 5% CONGE
        $rand = $this->faker->numberBetween(1, 100);
        if ($rand <= 5) {
          $statut = StatutPresence::ABSENT;
        } elseif ($rand <= 10) {
          $statut = StatutPresence::CONGE;
        } else {
          $statut = StatutPresence::PRESENT;
        }

        $presence
          ->setDatePresence(clone $datePresence)
          ->setHeureDebut($heureDebut)
          ->setHeureFin($heureFin)
          ->setStatut($statut)
          ->setTempsPresence(
            $statut === StatutPresence::PRESENT
              ? ($heureFin->getTimestamp() - $heureDebut->getTimestamp()) / 3600
              : 0
          )
          ->setEmploye($employe)
          ->setIlot($ilot);

        $manager->persist($presence);
        $this->addReference("PRESENCE_" . $refCounter, $presence);
        $refCounter++;
      }
    }

    $manager->flush();
  }

  public function getDependencies() {
    return [
      AffectationEmployeIlotFixtures::class,
      PlanningFixtures::class,
    ];
  }

  public static function getGroups(): array {
    return ['load'];
  }
}
