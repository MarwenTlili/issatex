WITH
    employes AS (
        SELECT ilot_id, COUNT(DISTINCT employe_id) AS nbr_employes
        FROM presence
        WHERE
            date_presence = '2025-01-20'
            AND statut = 'Present'
        GROUP BY
            ilot_id
    ),
    temps_presence_aggreg AS (
        SELECT ilot_id, SUM(temps_presence) AS total_temps_presence
        FROM presence
        WHERE
            date_presence = '2025-01-20'
            AND statut = 'Present'
        GROUP BY
            ilot_id
    ),
    quantites_demandées AS (
        SELECT pl.ilot_id, SUM(DISTINCT ofa.quantite_totale) AS quantite_demandée
        FROM
            planning pl
            JOIN ordre_fabrication ofa ON pl.ordre_fabrication_id = ofa.id
        GROUP BY
            pl.ilot_id
    )
SELECT
    i.id AS code_ilot,
    e.nbr_employes,
    COUNT(
        DISTINCT pl.ordre_fabrication_id
    ) AS nbr_of_traites,
    SUM(pro.quantite_totale) AS quantites_totales,
    qd.quantite_demandée,
    ROUND(
        (
            SUM(pro.quantite_totale) * 100.0
        ) / NULLIF(qd.quantite_demandée, 0),
        2
    ) AS rendement
FROM
    ilot i
    JOIN planning pl ON i.id = pl.ilot_id
    JOIN production pro ON pl.id = pro.planning_id
    AND pro.date_production = '2025-01-20'
    JOIN employes e ON i.id = e.ilot_id
    JOIN temps_presence_aggreg tp ON i.id = tp.ilot_id
    JOIN quantites_demandées qd ON i.id = qd.ilot_id
GROUP BY
    i.id,
    e.nbr_employes,
    tp.total_temps_presence,
    qd.quantite_demandée
ORDER BY i.id;

--  code_ilot | nbr_employes | nbr_of_traites | quantites_totales | quantites_demandées | rendement
-- -----------+--------------+----------------+-------------------+---------------------+-----------
--         13 |            5 |              1 |               249 |                4500 |      5.53

-------------------------------------------------------------------------------
-- quantités produit des plannings
SELECT
    i.id AS code_ilot,
    pl.id AS planning_id,
    -- pl.date_debut,
    -- pl.date_fin,
    SUM(pro.quantite_totale) AS somme_attendue
FROM
    ilot i
    JOIN planning pl ON i.id = pl.ilot_id
    JOIN production pro ON pl.id = pro.planning_id
WHERE
    pro.date_production BETWEEN pl.date_debut AND pl.date_fin
    AND pro.date_production = '2025-01-20'
GROUP BY
    i.id,
    pl.id
    -- pl.date_debut,
    -- pl.date_fin
ORDER BY i.id;

--  code_ilot | id | date_debut |  date_fin  | somme_attendue
-- -----------+----+------------+------------+----------------
--         15 | 11 | 2025-01-20 | 2025-01-25 |            691
--         16 | 12 | 2025-01-20 | 2025-01-25 |           1014
