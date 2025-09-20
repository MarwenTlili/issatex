<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250915203717 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE presence DROP CONSTRAINT fk_6977c7a5ecc6147f');
        $this->addSql('DROP INDEX idx_6977c7a5ecc6147f');
        $this->addSql('ALTER TABLE presence DROP production_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE presence ADD production_id INT NOT NULL');
        $this->addSql('ALTER TABLE presence ADD CONSTRAINT fk_6977c7a5ecc6147f FOREIGN KEY (production_id) REFERENCES production (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_6977c7a5ecc6147f ON presence (production_id)');
    }
}
