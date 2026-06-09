-- This is an empty migration.-- Adiciona a restrição para a nota ficar entre 1 e 5
ALTER TABLE `Avaliacao` ADD CONSTRAINT `chk_nota_range` CHECK (`nota` >= 1 AND `nota` <= 5);