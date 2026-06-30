"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function buscarAvaliacoesParaPainel() {
  return await prisma.avaliacao.findMany({
    include: {
      usuario: {
        select: {
          nome: true,
          email: true,
        },
      },
      estabelecimento: {
        select: {
          nome: true,
        },
      },
    },
    orderBy: [
      { aprovada: "asc" },
      { dataAvaliacao: "desc" }, 
    ],
  });
}

export async function aprovarAvaliacao(usuarioEmail: string, estabelecimentoId: number) {
  await prisma.avaliacao.update({
    where: {
      usuarioEmail_estabelecimentoId: {
        usuarioEmail,
        estabelecimentoId,
      },
    },
    data: {
      aprovada: true,
    },
  });

  const agregacao = await prisma.avaliacao.aggregate({
    where: { estabelecimentoId, aprovada: true },
    _avg: { nota: true },
    _count: { _all: true },
  });

  await prisma.estabelecimento.update({
    where: { id: estabelecimentoId },
    data: {
      mediaNota: agregacao._avg.nota || 0,
      numAvaliacoes: agregacao._count._all || 0,
    },
  });

  revalidatePath("/admin/avaliacoes");
  revalidatePath(`/estabelecimentos/${estabelecimentoId}`);
}

export async function rejeitarOuExcluirAvaliacao(usuarioEmail: string, estabelecimentoId: number) {
  await prisma.avaliacao.delete({
    where: {
      usuarioEmail_estabelecimentoId: {
        usuarioEmail,
        estabelecimentoId,
      },
    },
  });

  const agregacao = await prisma.avaliacao.aggregate({
    where: { estabelecimentoId, aprovada: true },
    _avg: { nota: true },
    _count: { _all: true },
  });

  await prisma.estabelecimento.update({
    where: { id: estabelecimentoId },
    data: {
      mediaNota: agregacao._avg.nota || 0,
      numAvaliacoes: agregacao._count._all || 0,
    },
  });

  revalidatePath("/admin/avaliacoes");
  revalidatePath(`/estabelecimentos/${estabelecimentoId}`);
}