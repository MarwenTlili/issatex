<?php

namespace App\DataFixtures;

use App\Entity\Planning;
use App\Entity\Production;
use App\Enum\StatutOF;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class ProductionFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface {
    protected $faker;

    public function load(ObjectManager $manager): void {
        $this->faker = Factory::create();

        /** @var Planning[] $plannings */
        $plannings = [];
        $i = 1;
        while ($this->hasReference("PLANNING_" . $i)) {
            $plannings[] = $this->getReference("PLANNING_" . $i);
            $i++;
        }

        foreach ($plannings as $pIndex => $planning) {
            $of = $planning->getOrdreFabrication();

            if (!$of) continue;

            // Only produce for IN_PROGRESS or COMPLETED
            if (!in_array($of->getStatut(), [StatutOF::IN_PROGRESS, StatutOF::COMPLETED])) {
                continue;
            }

            // Determine actual production window:
            $start = (clone $planning->getDateDebut())->setTime(0, 0, 0);
            $end = (clone $planning->getDateFin())->setTime(0, 0, 0);

            // If IN_PROGRESS, production stops at "today" (inclusive)
            $today = (new \DateTime())->setTime(0, 0, 0);
            if ($of->getStatut() === StatutOF::IN_PROGRESS && $today < $end) {
                // ensure we don't produce for future days
                $end = $today;
            }

            // Create inclusive DatePeriod
            $periodEndInclusive = (clone $end)->modify('+1 day');
            $period = new \DatePeriod($start, new \DateInterval('P1D'), $periodEndInclusive);

            // Build an indexed array of date objects for deterministic distribution
            $days = [];
            foreach ($period as $d) {
                // Only Monday -> Saturday allowed per your rule; skip Sundays just in case
                $weekday = (int) $d->format('N'); // 1 = Monday, 7 = Sunday
                if ($weekday === 7) {
                    continue;
                }
                $days[] = clone $d;
            }

            if (count($days) === 0) {
                // Nothing to produce this planning (edge-case)
                continue;
            }

            // For each TailleOrdreFabrication: distribute its quantite across the days
            foreach ($of->getTailleOFs() as $tailleIndex => $tailleOf) {
                $size = $tailleOf->getTailleArticle();
                $quantiteTotalForSize = (int) $tailleOf->getQuantite();

                // integer division and remainder distribution
                $daysCount = count($days);
                $base = intdiv($quantiteTotalForSize, $daysCount);
                $remainder = $quantiteTotalForSize % $daysCount;

                // prepare allocations: give +1 to $remainder random days
                $allocations = array_fill(0, $daysCount, $base);
                if ($remainder > 0) {
                    // shuffle indices and give +1 to first $remainder indices
                    $indices = range(0, $daysCount - 1);
                    shuffle($indices);
                    for ($r = 0; $r < $remainder; $r++) {
                        $allocations[$indices[$r]]++;
                    }
                }

                // Sanity check sum
                if (array_sum($allocations) !== $quantiteTotalForSize) {
                    // last-resort fix (shouldn't happen)
                    $diff = $quantiteTotalForSize - array_sum($allocations);
                    $allocations[0] += $diff;
                }

                // For each day, create a Production row for this taille
                foreach ($days as $dayIndex => $dateProduction) {
                    $dayQty = (int) $allocations[$dayIndex];

                    if ($dayQty <= 0) {
                        // skip zero-production days
                        continue;
                    }

                    // First / Second choice split: realistic ratio between 75% and 95% for first choice
                    $ratioFirst = $this->faker->randomFloat(2, 0.75, 0.95);
                    $qtyFirst = (int) floor($dayQty * $ratioFirst);
                    $qtySecond = $dayQty - $qtyFirst;

                    // Final sanity: ensure non-negative
                    if ($qtyFirst < 0) $qtyFirst = 0;
                    if ($qtySecond < 0) $qtySecond = 0;

                    $production = new Production();
                    // adjust field names to match your entity: dateProduction, tailleArticle, quantitePremiereChoix, quantiteDeuxiemeChoix, quantiteTotale, planning
                    $production->setDateProduction(clone $dateProduction)
                        ->setTailleArticle($size)
                        ->setQuantitePremiereChoix($qtyFirst)
                        ->setQuantiteDeuxiemeChoix($qtySecond)
                        ->setQuantiteTotale($qtyFirst + $qtySecond)
                        ->setPlanning($planning);

                    $manager->persist($production);

                    // optional reference for later tests: PRODUCTION_OF_{ofId}_{date}_{size}
                    $refName = sprintf(
                        'PRODUCTION_%s_%s_%s',
                        $of->getId() ?? $pIndex,
                        $dateProduction->format('Ymd'),
                        $size->value ?? (string)$size
                    );
                    // careful not to overwrite existing refs; use unique-suffix
                    $this->addReference($refName . '_' . uniqid(), $production);
                } // end foreach day
            } // end foreach taille
        } // end foreach planning

        $manager->flush();
    }

    public function getDependencies() {
        return [
            TailleOrdreFabricationFixtures::class,
            PlanningFixtures::class,
        ];
    }

    public static function getGroups(): array {
        return ['load'];
    }
}
