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

    /** @var AffectationEmployeIlot[] */
    $affectations = [];
    $i = 0;
    while ($this->hasReference("AFFECTATION_$i")) {
      $affectations[] = $this->getReference("AFFECTATION_$i");
      $i++;
    }

    /** @var Planning[] */
    $plannings = [];
    $j = 1;
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
        if ($datePresence > new \DateTimeImmutable("today")) {
          break;
        }
        $presence = new Presence();

        // Bias random status: 90% PRESENT, 3% RETARD, 5% ABSENT, 2% CONGE
        $statuses = [
          StatutPresence::PRESENT->value => 90,
          StatutPresence::RETARD->value  => 5,
          StatutPresence::ABSENT->value  => 3,
          StatutPresence::CONGE->value   => 2,
        ];

        $rand = $this->faker->numberBetween(1, 100);
        $current = 0;

        foreach ($statuses as $statusValue => $weight) {
          $current += $weight;
          if ($rand <= $current) {
            $statut = StatutPresence::from($statusValue);
            break;
          }
        }

        // Default working hours
        $heureDebut = (clone $datePresence)->setTime(8, 0, 0);
        $heureFin   = (clone $datePresence)->setTime(16, 0, 0);

        switch ($statut) {
          // Both ABSENT and CONGE WILL BE null, null, 0
          case StatutPresence::ABSENT:
          case StatutPresence::CONGE:
            $heureDebut = null;
            $heureFin   = null;
            $tempsPresence = 0;
            break;

          case StatutPresence::RETARD:
            // Arrives 15–120 minutes late
            $delayMinutes = $this->faker->numberBetween(1, 15);
            $heureDebut->modify("+$delayMinutes minutes");
            $tempsPresence = ($heureFin->getTimestamp() - $heureDebut->getTimestamp()) / 3600;
            break;

          case StatutPresence::PRESENT:
            $tempsPresence = ($heureFin->getTimestamp() - $heureDebut->getTimestamp()) / 3600;
            break;
        }

        $presence
          ->setDatePresence(clone $datePresence)
          ->setHeureDebut($heureDebut)
          ->setHeureFin($heureFin)
          ->setStatut($statut)
          ->setTempsPresence(max(0, $tempsPresence))
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
      ProductionFixtures::class
    ];
  }

  public static function getGroups(): array {
    return ['load'];
  }
}
