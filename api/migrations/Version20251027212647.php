<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251027212647 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE machine DROP CONSTRAINT FK_1505DF849A4BD21C');
        $this->addSql('ALTER TABLE machine ADD CONSTRAINT FK_1505DF849A4BD21C FOREIGN KEY (ilot_id) REFERENCES ilot (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE machine DROP CONSTRAINT fk_1505df849a4bd21c');
        $this->addSql('ALTER TABLE machine ADD CONSTRAINT fk_1505df849a4bd21c FOREIGN KEY (ilot_id) REFERENCES ilot (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }
}
