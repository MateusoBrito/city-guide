"use server";

import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getReviewSummary } from "./data";
import type { ReviewActionState } from "./types";

type ReviewInput = {
  estabelecimentoId: number;
  nota: number;
  comentario?: string;
};

function validarEntrada(input: ReviewInput) {
  if (!Number.isInteger(input.estabelecimentoId) || input.estabelecimentoId <= 0) {
    return "Estabelecimento inválido.";
  }

  if (!Number.isInteger(input.nota) || input.nota < 1 || input.nota > 5) {
    return "Selecione uma nota entre 1 e 5 estrelas.";
  }

  return null;
}

function limparComentario(comentario?: string) {
  const comentarioLimpo = comentario?.trim() ?? "";
  return comentarioLimpo.length > 0 ? comentarioLimpo : null;
}

async function getUsuarioEmailAutenticado() {
  const session = await getServerSession(authOptions);
  return session?.user?.email ?? null;
}

async function estabelecimentoExiste(estabelecimentoId: number) {
  const estabelecimento = await prisma.estabelecimento.findFirst({
    where: {
      id: estabelecimentoId,
      aprovado: true,
    },
    select: { id: true },
  });

  return Boolean(estabelecimento);
}

async function responderComResumo(
  estabelecimentoId: number,
  usuarioEmail: string,
  message: string,
): Promise<ReviewActionState> {
  revalidatePath(`/estabelecimentos/${estabelecimentoId}`);
  revalidatePath("/explorar");
  revalidatePath("/explore");

  return {
    ok: true,
    message,
    summary: await getReviewSummary(estabelecimentoId, usuarioEmail),
  };
}

export async function criarAvaliacao(
  input: ReviewInput,
): Promise<ReviewActionState> {
  const erroValidacao = validarEntrada(input);
  if (erroValidacao) return { ok: false, message: erroValidacao };

  const usuarioEmail = await getUsuarioEmailAutenticado();
  if (!usuarioEmail) {
    return { ok: false, message: "Faça login para enviar uma avaliação." };
  }

  if (!(await estabelecimentoExiste(input.estabelecimentoId))) {
    return { ok: false, message: "Estabelecimento não encontrado." };
  }

  try {
    await prisma.avaliacao.create({
      data: {
        usuarioEmail,
        estabelecimentoId: input.estabelecimentoId,
        nota: input.nota,
        comentario: limparComentario(input.comentario),
        aprovada: false,
      },
    });

    return responderComResumo(
      input.estabelecimentoId,
      usuarioEmail,
      "Avaliação enviada para aprovação.",
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        ok: false,
        message: "Você já possui uma avaliação para este estabelecimento.",
      };
    }

    return { ok: false, message: "Não foi possível enviar sua avaliação." };
  }
}

export async function editarAvaliacao(
  input: ReviewInput,
): Promise<ReviewActionState> {
  const erroValidacao = validarEntrada(input);
  if (erroValidacao) return { ok: false, message: erroValidacao };

  const usuarioEmail = await getUsuarioEmailAutenticado();
  if (!usuarioEmail) {
    return { ok: false, message: "Faça login para editar sua avaliação." };
  }

  const avaliacao = await prisma.avaliacao.findUnique({
    where: {
      usuarioEmail_estabelecimentoId: {
        usuarioEmail,
        estabelecimentoId: input.estabelecimentoId,
      },
    },
    select: { usuarioEmail: true },
  });

  if (!avaliacao) {
    return { ok: false, message: "Avaliação não encontrada." };
  }

  await prisma.avaliacao.update({
    where: {
      usuarioEmail_estabelecimentoId: {
        usuarioEmail,
        estabelecimentoId: input.estabelecimentoId,
      },
    },
    data: {
      nota: input.nota,
      comentario: limparComentario(input.comentario),
      aprovada: false,
      dataAvaliacao: new Date(),
    },
  });

  return responderComResumo(
    input.estabelecimentoId,
    usuarioEmail,
    "Alterações salvas e enviadas para aprovação.",
  );
}

export async function excluirAvaliacao(
  estabelecimentoId: number,
): Promise<ReviewActionState> {
  if (!Number.isInteger(estabelecimentoId) || estabelecimentoId <= 0) {
    return { ok: false, message: "Estabelecimento inválido." };
  }

  const usuarioEmail = await getUsuarioEmailAutenticado();
  if (!usuarioEmail) {
    return { ok: false, message: "Faça login para excluir sua avaliação." };
  }

  const avaliacao = await prisma.avaliacao.findUnique({
    where: {
      usuarioEmail_estabelecimentoId: {
        usuarioEmail,
        estabelecimentoId,
      },
    },
    select: { usuarioEmail: true },
  });

  if (!avaliacao) {
    return { ok: false, message: "Avaliação não encontrada." };
  }

  await prisma.avaliacao.delete({
    where: {
      usuarioEmail_estabelecimentoId: {
        usuarioEmail,
        estabelecimentoId,
      },
    },
  });

  return responderComResumo(
    estabelecimentoId,
    usuarioEmail,
    "Avaliação excluída.",
  );
}
