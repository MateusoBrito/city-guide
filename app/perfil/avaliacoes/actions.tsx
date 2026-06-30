"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function atualizarAvaliacao(
  usuarioEmail: string,
  estabelecimentoId: number,
  novaNota: number,
  novoComentario: string
) {
  if (!usuarioEmail || !estabelecimentoId) throw new Error("Dados inválidos.");

  await prisma.avaliacao.update({
    where: {
      usuarioEmail_estabelecimentoId: {
        usuarioEmail,
        estabelecimentoId,
      },
    },
    data: {
      nota: novaNota,
      comentario: novoComentario,
      aprovada: false, // Se o usuário editar, volta a precisar de aprovação do admin
    },
  });

  revalidatePath("/perfil/avaliacoes");
}

export async function buscarAvaliacoesDoUsuario(usuarioEmail: string) {
  if (!usuarioEmail) return [];

  // Busca TODAS as avaliações daquele e-mail, trazendo junto o nome do estabelecimento
  return await prisma.avaliacao.findMany({
    where: {
      usuarioEmail: usuarioEmail,
    },
    include: {
      estabelecimento: {
        select: {
          nome: true,
        },
      },
    },
    orderBy: {
      dataAvaliacao: "desc", // Mostra as mais recentes primeiro
    },
  });
}

export async function excluirAvaliacao(usuarioEmail: string, estabelecimentoId: number) {
  if (!usuarioEmail || !estabelecimentoId) throw new Error("Dados inválidos.");

  await prisma.avaliacao.delete({
    where: {
      usuarioEmail_estabelecimentoId: {
        usuarioEmail,
        estabelecimentoId,
      },
    },
  });

  revalidatePath("/perfil/avaliacoes");
}