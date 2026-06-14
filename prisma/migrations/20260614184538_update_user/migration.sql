-- DropForeignKey
ALTER TABLE `Usuario` DROP FOREIGN KEY `Usuario_cidadeId_fkey`;

-- DropIndex
DROP INDEX `Usuario_cidadeId_fkey` ON `Usuario`;

-- AlterTable
ALTER TABLE `Usuario` MODIFY `cidadeId` INTEGER NULL,
    MODIFY `dataNascimento` DATETIME(3) NULL,
    MODIFY `tipo` ENUM('visitante', 'usuario', 'admin', 'proprietario') NOT NULL DEFAULT 'usuario';

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_cidadeId_fkey` FOREIGN KEY (`cidadeId`) REFERENCES `Cidade`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
