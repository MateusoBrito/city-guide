-- AlterTable
ALTER TABLE `Cidade` ALTER COLUMN `latitude` DROP DEFAULT,
    ALTER COLUMN `longitude` DROP DEFAULT;

-- CreateTable
CREATE TABLE `_UsuarioFavoritos` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_UsuarioFavoritos_AB_unique`(`A`, `B`),
    INDEX `_UsuarioFavoritos_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_UsuarioFavoritos` ADD CONSTRAINT `_UsuarioFavoritos_A_fkey` FOREIGN KEY (`A`) REFERENCES `Estabelecimento`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UsuarioFavoritos` ADD CONSTRAINT `_UsuarioFavoritos_B_fkey` FOREIGN KEY (`B`) REFERENCES `Usuario`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;
