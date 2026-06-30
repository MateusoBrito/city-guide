"use server";

import { prisma } from "@/app/lib/prisma";

export async function gerarRelatorioRanking() {
  // Busca os top 10 estabelecimentos, ordenados pela nota e cruzando dados
  const ranking = await prisma.estabelecimento.findMany({
    where: { aprovado: true },
    take: 10,
    orderBy: [
      { mediaNota: "desc" }, 
      { numAvaliacoes: "desc" } 
    ],
    include: {
      cidade: true, 
      _count: {
        select: { favoritadoPor: true }
      }
    }
  });

  return ranking;
}