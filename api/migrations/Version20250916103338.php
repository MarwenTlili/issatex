<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250916103338 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE presence ADD ilot_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE presence ADD CONSTRAINT FK_6977C7A59A4BD21C FOREIGN KEY (ilot_id) REFERENCES ilot (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_6977C7A59A4BD21C ON presence (ilot_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE presence DROP CONSTRAINT FK_6977C7A59A4BD21C');
        $this->addSql('DROP INDEX IDX_6977C7A59A4BD21C');
        $this->addSql('ALTER TABLE presence DROP ilot_id');
    }
}
