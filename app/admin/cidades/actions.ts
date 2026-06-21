"use server";

import {prisma} from "@/app/lib/prisma";
import {revalidatePath} from "next/cache";

export async function criarCidade(formData: FormData) {
  const nome = formData.get("nome") as string;
  const estado = formData.get("estado") as string;
  const pais = formData.get("pais") as string;

  if (!nome || !estado || !pais) {
    throw new Error("Todos os campos são obrigatórios.");
  }

  await prisma.cidade.create({
    data: {
      nome,
      estado,
      pais,
    },
  });

  revalidatePath("/admin/cidades");
}

export async function listarCidades() {
  return await prisma.cidade.findMany({
    orderBy: { nome: "asc" },
  });
}