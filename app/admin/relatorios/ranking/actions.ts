"use server";

import prisma from "@/app/lib/prisma";

export async function gerarRelatorioRanking(categoriaDesejada?: string) {
  const ranking = await prisma.estabelecimento.findMany({
    where: { 
      aprovado: true,
      // Se o admin escolheu uma categoria, o Prisma filtra por ela
      // Se não escolheu, ignora o filtro de categoria
      ...(categoriaDesejada && categoriaDesejada !== "Todas" ? { categoria: categoriaDesejada } : {}) 
    },
    take: 10, 
    orderBy: [
      { mediaNota: "desc" },    // critério principal: Maior nota
      { numAvaliacoes: "desc" } // critério de desempate: Mais avaliado
    ],
    include: {
      cidade: true, // Cruza com a cidade
      _count: {
        select: { favoritadoPor: true } // cruza com a contagem de favoritos 
      }
    }
  });

  return ranking;
}

export async function buscarCategoriasDisponiveis() {
  const estabelecimentos = await prisma.estabelecimento.findMany({
    where: { aprovado: true },
    distinct: ["categoria"],
    select: { categoria: true },
  });

  return estabelecimentos.map((e) => e.categoria).sort();
}