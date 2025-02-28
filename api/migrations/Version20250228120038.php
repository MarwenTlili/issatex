<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250228120038 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE affectation_employe_ilot_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE article_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE client_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE employe_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE ilot_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE machine_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE notification_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE ordre_fabrication_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE planning_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE presence_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE production_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE refresh_tokens_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE taille_ordre_fabrication_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE "user_id_seq" INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE affectation_employe_ilot (id INT NOT NULL, employe_id INT NOT NULL, ilot_id INT NOT NULL, ref VARCHAR(255) DEFAULT NULL, responsable BOOLEAN DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_1C3FEDC5146F3EA3 ON affectation_employe_ilot (ref)');
        $this->addSql('CREATE INDEX IDX_1C3FEDC51B65292 ON affectation_employe_ilot (employe_id)');
        $this->addSql('CREATE INDEX IDX_1C3FEDC59A4BD21C ON affectation_employe_ilot (ilot_id)');
        $this->addSql('CREATE TABLE article (id INT NOT NULL, client_id INT NOT NULL, ref VARCHAR(255) DEFAULT NULL, designation VARCHAR(255) NOT NULL, composition TEXT DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_23A0E66146F3EA3 ON article (ref)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_23A0E668947610D ON article (designation)');
        $this->addSql('CREATE INDEX IDX_23A0E6619EB6921 ON article (client_id)');
        $this->addSql('CREATE TABLE client (id INT NOT NULL, account_id INT NOT NULL, ref VARCHAR(255) DEFAULT NULL, nom VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, adresse VARCHAR(255) DEFAULT NULL, privilegie BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_C7440455146F3EA3 ON client (ref)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_C74404556C6E55B5 ON client (nom)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_C7440455E7927C74 ON client (email)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_C74404559B6B5FBA ON client (account_id)');
        $this->addSql('CREATE TABLE employe (id INT NOT NULL, ref VARCHAR(255) DEFAULT NULL, nom VARCHAR(255) NOT NULL, prenom VARCHAR(255) NOT NULL, poste VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_F804D3B9146F3EA3 ON employe (ref)');
        $this->addSql('CREATE TABLE ilot (id INT NOT NULL, ref VARCHAR(255) DEFAULT NULL, nom VARCHAR(255) NOT NULL, description TEXT DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_93AA979C146F3EA3 ON ilot (ref)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_93AA979C6C6E55B5 ON ilot (nom)');
        $this->addSql('CREATE TABLE machine (id INT NOT NULL, ilot_id INT DEFAULT NULL, ref VARCHAR(255) DEFAULT NULL, nom VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL, statut VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_1505DF84146F3EA3 ON machine (ref)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_1505DF846C6E55B5 ON machine (nom)');
        $this->addSql('CREATE INDEX IDX_1505DF849A4BD21C ON machine (ilot_id)');
        $this->addSql('CREATE TABLE notification (id INT NOT NULL, account_id INT NOT NULL, expediteur VARCHAR(255) NOT NULL, titre VARCHAR(255) NOT NULL, message TEXT NOT NULL, date_creation TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, lu BOOLEAN NOT NULL, type VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_BF5476CA9B6B5FBA ON notification (account_id)');
        $this->addSql('CREATE TABLE ordre_fabrication (id INT NOT NULL, client_id INT NOT NULL, article_id INT NOT NULL, ref VARCHAR(255) DEFAULT NULL, date_creation TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, date_cloture TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, urgent BOOLEAN NOT NULL, statut VARCHAR(255) NOT NULL, quantite_totale INT NOT NULL, prix_unitaire NUMERIC(10, 2) NOT NULL, temps_unitaire INT NOT NULL, lance BOOLEAN DEFAULT false NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_7FB222D2146F3EA3 ON ordre_fabrication (ref)');
        $this->addSql('CREATE INDEX IDX_7FB222D219EB6921 ON ordre_fabrication (client_id)');
        $this->addSql('CREATE INDEX IDX_7FB222D27294869C ON ordre_fabrication (article_id)');
        $this->addSql('CREATE TABLE planning (id INT NOT NULL, ordre_fabrication_id INT NOT NULL, ilot_id INT NOT NULL, ref VARCHAR(255) DEFAULT NULL, date_creation TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, date_debut DATE NOT NULL, date_fin DATE NOT NULL, reporte BOOLEAN DEFAULT false NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_D499BFF6146F3EA3 ON planning (ref)');
        $this->addSql('CREATE INDEX IDX_D499BFF66A91B091 ON planning (ordre_fabrication_id)');
        $this->addSql('CREATE INDEX IDX_D499BFF69A4BD21C ON planning (ilot_id)');
        $this->addSql('CREATE TABLE presence (id INT NOT NULL, employe_id INT NOT NULL, production_id INT NOT NULL, ref VARCHAR(255) DEFAULT NULL, date_presence DATE NOT NULL, heure_debut TIME(0) WITHOUT TIME ZONE DEFAULT NULL, heure_fin TIME(0) WITHOUT TIME ZONE DEFAULT NULL, statut VARCHAR(255) NOT NULL, temps_presence INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_6977C7A5146F3EA3 ON presence (ref)');
        $this->addSql('CREATE INDEX IDX_6977C7A51B65292 ON presence (employe_id)');
        $this->addSql('CREATE INDEX IDX_6977C7A5ECC6147F ON presence (production_id)');
        $this->addSql('CREATE TABLE production (id INT NOT NULL, planning_id INT NOT NULL, ref VARCHAR(255) DEFAULT NULL, date_production DATE NOT NULL, taille_article VARCHAR(255) NOT NULL, quantite_premiere_choix INT NOT NULL, quantite_deuxieme_choix INT NOT NULL, quantite_totale INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_D3EDB1E0146F3EA3 ON production (ref)');
        $this->addSql('CREATE INDEX IDX_D3EDB1E03D865311 ON production (planning_id)');
        $this->addSql('CREATE TABLE refresh_tokens (id INT NOT NULL, refresh_token VARCHAR(128) NOT NULL, username VARCHAR(255) NOT NULL, valid TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_9BACE7E1C74F2195 ON refresh_tokens (refresh_token)');
        $this->addSql('CREATE TABLE taille_ordre_fabrication (id INT NOT NULL, ordre_fabrication_id INT NOT NULL, ref VARCHAR(255) DEFAULT NULL, taille_article VARCHAR(255) NOT NULL, quantite INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_345AC7DE146F3EA3 ON taille_ordre_fabrication (ref)');
        $this->addSql('CREATE INDEX IDX_345AC7DE6A91B091 ON taille_ordre_fabrication (ordre_fabrication_id)');
        $this->addSql('CREATE TABLE "user" (id INT NOT NULL, ref VARCHAR(255) DEFAULT NULL, username VARCHAR(30) NOT NULL, email VARCHAR(180) NOT NULL, password VARCHAR(255) NOT NULL, roles JSON NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649146F3EA3 ON "user" (ref)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON "user" (email)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_IDENTIFIER ON "user" (email, username)');
        $this->addSql('ALTER TABLE affectation_employe_ilot ADD CONSTRAINT FK_1C3FEDC51B65292 FOREIGN KEY (employe_id) REFERENCES employe (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE affectation_employe_ilot ADD CONSTRAINT FK_1C3FEDC59A4BD21C FOREIGN KEY (ilot_id) REFERENCES ilot (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE article ADD CONSTRAINT FK_23A0E6619EB6921 FOREIGN KEY (client_id) REFERENCES client (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE client ADD CONSTRAINT FK_C74404559B6B5FBA FOREIGN KEY (account_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE machine ADD CONSTRAINT FK_1505DF849A4BD21C FOREIGN KEY (ilot_id) REFERENCES ilot (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE notification ADD CONSTRAINT FK_BF5476CA9B6B5FBA FOREIGN KEY (account_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE ordre_fabrication ADD CONSTRAINT FK_7FB222D219EB6921 FOREIGN KEY (client_id) REFERENCES client (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE ordre_fabrication ADD CONSTRAINT FK_7FB222D27294869C FOREIGN KEY (article_id) REFERENCES article (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE planning ADD CONSTRAINT FK_D499BFF66A91B091 FOREIGN KEY (ordre_fabrication_id) REFERENCES ordre_fabrication (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE planning ADD CONSTRAINT FK_D499BFF69A4BD21C FOREIGN KEY (ilot_id) REFERENCES ilot (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE presence ADD CONSTRAINT FK_6977C7A51B65292 FOREIGN KEY (employe_id) REFERENCES employe (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE presence ADD CONSTRAINT FK_6977C7A5ECC6147F FOREIGN KEY (production_id) REFERENCES production (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE production ADD CONSTRAINT FK_D3EDB1E03D865311 FOREIGN KEY (planning_id) REFERENCES planning (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE taille_ordre_fabrication ADD CONSTRAINT FK_345AC7DE6A91B091 FOREIGN KEY (ordre_fabrication_id) REFERENCES ordre_fabrication (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE affectation_employe_ilot_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE article_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE client_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE employe_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE ilot_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE machine_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE notification_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE ordre_fabrication_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE planning_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE presence_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE production_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE refresh_tokens_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE taille_ordre_fabrication_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE "user_id_seq" CASCADE');
        $this->addSql('ALTER TABLE affectation_employe_ilot DROP CONSTRAINT FK_1C3FEDC51B65292');
        $this->addSql('ALTER TABLE affectation_employe_ilot DROP CONSTRAINT FK_1C3FEDC59A4BD21C');
        $this->addSql('ALTER TABLE article DROP CONSTRAINT FK_23A0E6619EB6921');
        $this->addSql('ALTER TABLE client DROP CONSTRAINT FK_C74404559B6B5FBA');
        $this->addSql('ALTER TABLE machine DROP CONSTRAINT FK_1505DF849A4BD21C');
        $this->addSql('ALTER TABLE notification DROP CONSTRAINT FK_BF5476CA9B6B5FBA');
        $this->addSql('ALTER TABLE ordre_fabrication DROP CONSTRAINT FK_7FB222D219EB6921');
        $this->addSql('ALTER TABLE ordre_fabrication DROP CONSTRAINT FK_7FB222D27294869C');
        $this->addSql('ALTER TABLE planning DROP CONSTRAINT FK_D499BFF66A91B091');
        $this->addSql('ALTER TABLE planning DROP CONSTRAINT FK_D499BFF69A4BD21C');
        $this->addSql('ALTER TABLE presence DROP CONSTRAINT FK_6977C7A51B65292');
        $this->addSql('ALTER TABLE presence DROP CONSTRAINT FK_6977C7A5ECC6147F');
        $this->addSql('ALTER TABLE production DROP CONSTRAINT FK_D3EDB1E03D865311');
        $this->addSql('ALTER TABLE taille_ordre_fabrication DROP CONSTRAINT FK_345AC7DE6A91B091');
        $this->addSql('DROP TABLE affectation_employe_ilot');
        $this->addSql('DROP TABLE article');
        $this->addSql('DROP TABLE client');
        $this->addSql('DROP TABLE employe');
        $this->addSql('DROP TABLE ilot');
        $this->addSql('DROP TABLE machine');
        $this->addSql('DROP TABLE notification');
        $this->addSql('DROP TABLE ordre_fabrication');
        $this->addSql('DROP TABLE planning');
        $this->addSql('DROP TABLE presence');
        $this->addSql('DROP TABLE production');
        $this->addSql('DROP TABLE refresh_tokens');
        $this->addSql('DROP TABLE taille_ordre_fabrication');
        $this->addSql('DROP TABLE "user"');
    }
}
