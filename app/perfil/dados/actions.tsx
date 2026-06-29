"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function atualizarPerfilUsuario(formData: FormData) {
  const email = formData.get("email") as string;
  const dataNascimentoString = formData.get("dataNascimento") as string;
  const cidadeIdString = formData.get("cidadeId") as string;

  if (!email) {
    throw new Error("Usuário não identificado.");
  }

  const dataNascimento = dataNascimentoString ? new Date(dataNascimentoString) : null;
  const cidadeId = cidadeIdString ? parseInt(cidadeIdString) : null;

  await prisma.usuario.update({
    where: { email },
    data: {
      dataNascimento,
      cidadeId,
    },
  });

  revalidatePath("/perfil");
}