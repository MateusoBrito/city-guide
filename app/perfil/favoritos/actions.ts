"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function listarFavoritos(email: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { email },
    include: { favoritos: { include: { cidade: true } } }
  });
  return usuario?.favoritos || [];
}

export async function alternarFavorito(email: string, estabelecimentoId: number) {
  if (!email) throw new Error("Usuário não autenticado.");

  const usuario = await prisma.usuario.findUnique({
    where: { email },
    include: { favoritos: { where: { id: estabelecimentoId } } }
  });

  const jaFavorito = (usuario?.favoritos?.length || 0) > 0;

  if (jaFavorito) {
    await prisma.usuario.update({
      where: { email },
      data: { favoritos: { disconnect: { id: estabelecimentoId } } }
    });
  } else {
    await prisma.usuario.update({
      where: { email },
      data: { favoritos: { connect: { id: estabelecimentoId } } }
    });
  }

  revalidatePath("/perfil/favoritos");
  revalidatePath("/explorar"); 
}