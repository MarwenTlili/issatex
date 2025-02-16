-- Rendement Quotidien par Ilot
WITH
    vars AS (
        SELECT '2025-02-03'::date AS target_date
    ),
    empl_counts AS (
        SELECT aei.ilot_id AS Ilot, COUNT(DISTINCT aei.employe_id) AS nbr_emples
        FROM affectation_employe_ilot aei
        GROUP BY
            aei.ilot_id
    ),
    traites_counts AS (
        SELECT pla.ilot_id AS Ilot, COUNT(DISTINCT pla.id) AS nbr_of_traites
        FROM planning pla
        GROUP BY
            pla.ilot_id
    ),
    quantites AS (
        SELECT pla.ilot_id AS Ilot, COALESCE(SUM(pro.quantite_totale), 0) AS quantites_totales
        FROM
            production pro
            JOIN planning pla ON pro.planning_id = pla.id
            CROSS JOIN vars
        WHERE
            pro.date_production = vars.target_date
        GROUP BY
            pla.ilot_id
    ),
    presence_data AS (
        SELECT aei.ilot_id AS Ilot, COALESCE(
                SUM(pr.temps_presence) * 60, 0
            ) AS temps_presence_min
        FROM
            presence pr
            JOIN affectation_employe_ilot aei ON pr.employe_id = aei.employe_id
            CROSS JOIN vars
        WHERE
            pr.date_presence = vars.target_date
        GROUP BY
            aei.ilot_id
    ),
    productif_data AS (
        SELECT pla.ilot_id AS Ilot, COALESCE(
                SUM(
                    pro.quantite_totale * (of.temps_unitaire / 100)
                ), 0
            ) AS temps_productif
        FROM
            production pro
            JOIN planning pla ON pro.planning_id = pla.id
            JOIN ordre_fabrication of ON pla.ordre_fabrication_id = of.id
            CROSS JOIN vars
        WHERE
            pro.date_production = vars.target_date
        GROUP BY
            pla.ilot_id
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
        ELSE ROUND(
            COALESCE(prod.temps_productif, 0) * 100.0 / p.temps_presence_min,
            2
        )
    END AS "rendement (%)"
FROM
    ilot i
    LEFT JOIN empl_counts e ON i.id = e.Ilot
    LEFT JOIN traites_counts t ON i.id = t.Ilot
    LEFT JOIN quantites q ON i.id = q.Ilot
    LEFT JOIN presence_data p ON i.id = p.Ilot
    LEFT JOIN productif_data prod ON i.id = prod.Ilot;
--  ilot | nbr_emples | nbr_of_traites | quantites_totales | temps_presence (min) | temps_productif | rendement (%)
-- ------+------------+----------------+-------------------+----------------------+-----------------+---------------
--    81 |          6 |              2 |               298 |                16320 |            8940 |         54.78
--    82 |          6 |              1 |               165 |                 7680 |            4950 |         64.45
-- (2 rows)
-----------------------------------------------------------------------------------
-- 1. Valider les sous-requêtes individuellement
-- empl_counts : Vérifie si le nombre d'employés par îlot est correct en le
-- comparant avec un comptage manuel à partir de la table affectation_employe_ilot
SELECT ilot_id, COUNT(DISTINCT employe_id)
FROM affectation_employe_ilot
GROUP BY
    ilot_id;

-- traites_counts : Vérifie le nombre de traitements effectués pour chaque îlot.
SELECT ilot_id, COUNT(DISTINCT id) FROM planning GROUP BY ilot_id;

-- quantites : Vérifie les quantités totales produites à la date cible.
SELECT pla.ilot_id, SUM(pro.quantite_totale)
FROM production pro
    JOIN planning pla ON pro.planning_id = pla.id
WHERE
    pro.date_production = '2025-01-27'
GROUP BY
    pla.ilot_id;

-- presence_data : Vérifie le temps de présence total en minutes.
SELECT aei.ilot_id, SUM(pr.temps_presence) * 60 AS "temps_presence (min)"
FROM
    presence pr
    JOIN affectation_employe_ilot aei ON pr.employe_id = aei.employe_id
WHERE
    pr.date_presence = '2025-01-27'
GROUP BY
    aei.ilot_id;

-- productif_data : Vérifie le temps productif.
SELECT pla.ilot_id, SUM(
        pro.quantite_totale * (of.temps_unitaire / 100)
    )
FROM
    production pro
    JOIN planning pla ON pro.planning_id = pla.id
    JOIN ordre_fabrication of ON pla.ordre_fabrication_id = of.id
WHERE
    pro.date_production = '2025-01-27'
GROUP BY
    pla.ilot_id;
-----------------------------------------------------------------------------------
