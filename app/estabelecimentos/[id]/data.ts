import "server-only";

import prisma from "@/app/lib/prisma";
import type { ReviewSummary } from "./types";

export async function getReviewSummary(
  estabelecimentoId: number,
  usuarioEmail?: string | null,
): Promise<ReviewSummary> {
  const [estabelecimento, avaliacoes, minhaAvaliacao] = await Promise.all([
    prisma.estabelecimento.findUnique({
      where: { id: estabelecimentoId },
      select: {
        mediaNota: true,
        numAvaliacoes: true,
      },
    }),
    prisma.avaliacao.findMany({
      where: {
        estabelecimentoId,
        aprovada: true,
      },
      orderBy: { dataAvaliacao: "desc" },
      select: {
        usuarioEmail: true,
        nota: true,
        comentario: true,
        dataAvaliacao: true,
        usuario: {
          select: {
            nome: true,
          },
        },
      },
    }),
    usuarioEmail
      ? prisma.avaliacao.findUnique({
          where: {
            usuarioEmail_estabelecimentoId: {
              usuarioEmail,
              estabelecimentoId,
            },
          },
          select: {
            nota: true,
            comentario: true,
            aprovada: true,
            dataAvaliacao: true,
          },
        })
      : Promise.resolve(null),
  ]);

  return {
    mediaNota: estabelecimento?.mediaNota ?? 0,
    numAvaliacoes: estabelecimento?.numAvaliacoes ?? 0,
    avaliacoes: avaliacoes.map((avaliacao) => ({
      usuarioEmail: avaliacao.usuarioEmail,
      usuarioNome: avaliacao.usuario.nome,
      nota: avaliacao.nota,
      comentario: avaliacao.comentario,
      dataAvaliacao: avaliacao.dataAvaliacao.toISOString(),
    })),
    minhaAvaliacao: minhaAvaliacao
      ? {
          nota: minhaAvaliacao.nota,
          comentario: minhaAvaliacao.comentario,
          aprovada: minhaAvaliacao.aprovada,
          dataAvaliacao: minhaAvaliacao.dataAvaliacao.toISOString(),
        }
      : null,
  };
}

export async function getEstabelecimentoDetalhe(estabelecimentoId: number) {
  return prisma.estabelecimento.findFirst({
    where: {
      id: estabelecimentoId,
      aprovado: true,
    },
    include: {
      cidade: true,
    },
  });
}
