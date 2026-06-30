-- DropForeignKey
ALTER TABLE `Estabelecimento` DROP FOREIGN KEY `Estabelecimento_cidadeId_fkey`;

-- DropIndex
DROP INDEX `Estabelecimento_cidadeId_fkey` ON `Estabelecimento`;

-- AddForeignKey
ALTER TABLE `Estabelecimento` ADD CONSTRAINT `Estabelecimento_cidadeId_fkey` FOREIGN KEY (`cidadeId`) REFERENCES `Cidade`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
