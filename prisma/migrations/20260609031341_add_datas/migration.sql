/*
  Warnings:

  - Added the required column `dataNascimento` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Avaliacao` ADD COLUMN `dataAvaliacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Usuario` ADD COLUMN `dataNascimento` DATETIME(3) NOT NULL;
