-- AlterTable
ALTER TABLE `Avaliacao` ADD COLUMN `aprovada` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Estabelecimento` ADD COLUMN `aprovado` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `imagemUrl` VARCHAR(191) NULL,
    ADD COLUMN `mediaNota` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `numAvaliacoes` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `proprietarioEmail` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Usuario` ADD COLUMN `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `ehAdministrador` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `ehProprietario` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `Estabelecimento` ADD CONSTRAINT `Estabelecimento_proprietarioEmail_fkey` FOREIGN KEY (`proprietarioEmail`) REFERENCES `Usuario`(`email`) ON DELETE SET NULL ON UPDATE CASCADE;
