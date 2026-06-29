-- AlterTable
ALTER TABLE `Cidade` ADD COLUMN `latitude` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `longitude` DOUBLE NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `Estabelecimento` ADD COLUMN `latitude` DOUBLE NULL,
    ADD COLUMN `longitude` DOUBLE NULL;
