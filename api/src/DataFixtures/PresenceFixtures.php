<?php

namespace App\DataFixtures;

use App\Entity\Planning;
use App\Entity\Presence;
use App\Enum\StatutPresence;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class PresenceFixtures extends Fixture implements DependentFixtureInterface {
  protected $faker;

  public function load(ObjectManager $manager): void {
    $this->faker = Factory::create();

    /** @var Planning $planning_0 */
    $planning_0 = $this->getReference(PlanningFixtures::PLANNING_0);

    /** @var Planning $planning_1 */
    $planning_1 = $this->getReference(PlanningFixtures::PLANNING_1);

    // jours
    for ($i = 0; $i < 6; $i++) {
      // employes
      for ($j = 0; $j < 12; $j++) {
        // chaque 6 employes fait une planning
        $planning = $j < 6 ? $planning_0 : $planning_1;

        $jour = clone $planning->getDateDebut();
        if ($jour instanceof \DateTime) {
          // Remet l'offset à 0 pour le nouveau planning
          $offset = $i % 6;
          $jour->modify("+" . $offset . " day");

          $presence = new Presence();
          // Locale time with timezone
          $heureDebut = \DateTime::createFromFormat("H:i:s", "08:00:00", new \DateTimeZone('Africa/Tunis'));
          // Convert locale time to UTC 
          $heureDebut->setTimezone(new \DateTimeZone('UTC'));

          $heureFin = clone $heureDebut;
          $heureFin->modify("+9 hours");

          // Probabilité de 5 % pour l'absence
          $isAbsent = $this->faker->boolean(5); // 5 % de chance de retourner true

          $presence->setDatePresence($jour)
            ->setHeureDebut($heureDebut)
            ->setHeureFin($heureFin)
            ->setStatut($isAbsent ? StatutPresence::ABSENT : StatutPresence::PRESENT)
            ->setTempsPresence($isAbsent ? 0 : 8)
            ->setEmploye($this->getReference(sprintf("EMPLOYE_%d", $j)))
            ->setIlot($planning->getIlot())
            ->setPlanning($planning)
          ;

          $manager->persist($presence);
        }
      }
    }
    $manager->flush();
  }

  public function getDependencies() {
    return [
      EmployeFixtures::class,
      IlotFixtures::class,
      PlanningFixtures::class
    ];
  }
}
