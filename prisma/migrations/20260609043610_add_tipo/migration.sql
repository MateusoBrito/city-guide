/*
  Warnings:

  - You are about to drop the column `ehAdministrador` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `ehProprietario` on the `Usuario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Usuario` DROP COLUMN `ehAdministrador`,
    DROP COLUMN `ehProprietario`,
    ADD COLUMN `tipo` ENUM('usuario', 'admin', 'proprietario') NOT NULL DEFAULT 'usuario';
