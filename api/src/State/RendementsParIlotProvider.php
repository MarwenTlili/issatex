<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Dto\RendementsParIlotDto;
use Doctrine\ORM\EntityManagerInterface;

final class RendementsParIlotProvider implements ProviderInterface {
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager) {
        $this->entityManager = $entityManager;
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null {
        $date = $uriVariables['date'];

        $conn = $this->entityManager->getConnection();
        $sql = <<<SQL
            WITH vars AS (
                SELECT :date::date AS target_date
            ),
            empl_counts AS (
                SELECT aei.ilot_id AS Ilot, COUNT(DISTINCT aei.employe_id) AS nbr_emples
                FROM affectation_employe_ilot aei
                GROUP BY aei.ilot_id
            ),
            traites_counts AS (
                SELECT pla.ilot_id AS Ilot, COUNT(DISTINCT pla.id) AS nbr_of_traites
                FROM planning pla
                GROUP BY pla.ilot_id
            ),
            quantites AS (
                SELECT pla.ilot_id AS Ilot, COALESCE(SUM(pro.quantite_totale), 0) AS quantites_totales
                FROM production pro
                JOIN planning pla ON pro.planning_id = pla.id
                CROSS JOIN vars
                WHERE pro.date_production = vars.target_date
                GROUP BY pla.ilot_id
            ),
            presence_data AS (
                SELECT aei.ilot_id AS Ilot, COALESCE(SUM(pr.temps_presence) * 60, 0) AS temps_presence_min
                FROM presence pr
                JOIN affectation_employe_ilot aei ON pr.employe_id = aei.employe_id
                CROSS JOIN vars
                WHERE pr.date_presence = vars.target_date
                GROUP BY aei.ilot_id
            ),
            productif_data AS (
                SELECT pla.ilot_id AS Ilot, COALESCE(SUM(pro.quantite_totale * (of.temps_unitaire / 100)), 0) AS temps_productif
                FROM production pro
                JOIN planning pla ON pro.planning_id = pla.id
                JOIN ordre_fabrication of ON pla.ordre_fabrication_id = of.id
                CROSS JOIN vars
                WHERE pro.date_production = vars.target_date
                GROUP BY pla.ilot_id
            )
            SELECT 
                i.id AS Ilot,
                COALESCE(e.nbr_emples, 0) AS nbr_emples,
                COALESCE(t.nbr_of_traites, 0) AS nbr_of_traites,
                COALESCE(q.quantites_totales, 0) AS quantites_totales,
                COALESCE(p.temps_presence_min, 0) AS temps_presence_min,
                COALESCE(prod.temps_productif, 0) AS temps_productif,
                CASE 
                    WHEN COALESCE(p.temps_presence_min, 0) = 0 THEN 0
                    ELSE ROUND(COALESCE(prod.temps_productif, 0) * 100.0 / p.temps_presence_min, 2)
                END AS rendement
            FROM ilot i
            LEFT JOIN empl_counts e ON i.id = e.Ilot
            LEFT JOIN traites_counts t ON i.id = t.Ilot
            LEFT JOIN quantites q ON i.id = q.Ilot
            LEFT JOIN presence_data p ON i.id = p.Ilot
            LEFT JOIN productif_data prod ON i.id = prod.Ilot;
        SQL;

        $resultSet = $conn->executeQuery($sql, ['date' => $date]);

        // With SQL, you will get back raw data, not objects (unless you use the NativeQuery functionality).
        $results = $resultSet->fetchAllAssociative();

        $rendements = array_map(fn($row) => RendementsParIlotDto::fromArray($row), $results);

        return $rendements;
    }
}
