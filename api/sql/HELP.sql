-- delete the public schema (all tables)
DROP SCHEMA public CASCADE;

-- create new public schema for tables
CREATE SCHEMA public;
-------------------------------------------------------------------------------
-- tables

SELECT * FROM article;

SELECT * FROM ilot;

SELECT * FROM employe;

SELECT * FROM ordre_fabrication;

SELECT * FROM taille_ordre_fabrication;

SELECT * FROM affectation_employe_ilot;

SELECT * FROM planning;

SELECT * FROM production;

SELECT * FROM presence;
-------------------------------------------------------------------------------
-- select sequences name
SELECT sequence_schema, sequence_name
FROM information_schema.sequences
ORDER BY sequence_name;
-------------------------------------------------------------------------------
-- reset sequence value to 1
ALTER SEQUENCE article_id_seq RESTART WITH 1;
-------------------------------------------------------------------------------
-- reset auto_increment sequence for all tables
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Loop through all sequences in the database
    FOR r IN
        SELECT sequence_name
        FROM information_schema.sequences
        WHERE sequence_schema = 'public'  -- Adjust schema if needed
    LOOP
        -- Reset each sequence to 1
        EXECUTE 'ALTER SEQUENCE ' || r.sequence_name || ' RESTART WITH 1';
    END LOOP;
END $$;
-------------------------------------------------------------------------------