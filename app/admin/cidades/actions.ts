"use server";

import {prisma} from "@/app/lib/prisma";
import {revalidatePath} from "next/cache";

export async function listarCidades() {
  return await prisma.cidade.findMany({
    orderBy: { nome: "asc" },
  });
}

export async function criarCidade(formData: FormData) {
  const nome = formData.get("nome") as string;
  const estado = formData.get("estado") as string;
  const pais = formData.get("pais") as string;
  
  const latitudeString = formData.get("latitude") as string;
  const longitudeString = formData.get("longitude") as string;

  if (!nome || !estado || !pais || !latitudeString || !longitudeString) {
    throw new Error("Preencha todos os campos e selecione a localização no mapa.");
  }

  const latitude = parseFloat(latitudeString);
  const longitude = parseFloat(longitudeString);

  await prisma.cidade.create({
    data: {
      nome,
      estado,
      pais,
      latitude,  
      longitude,
    }
  });
}

export async function deletarCidade(id: number) {
  if (!id) throw new Error("ID inválido.");

  await prisma.cidade.delete({
    where: { id },
  });

  revalidatePath("/admin/cidades");
  revalidatePath("/explorar"); 
}

export async function editarCidade(id: number, formData: FormData) {
  const nome = formData.get("nome") as string;
  const estado = formData.get("estado") as string;
  const pais = formData.get("pais") as string;
  
  const latitudeString = formData.get("latitude") as string;
  const longitudeString = formData.get("longitude") as string;

  if (!nome || !estado || !pais || !latitudeString || !longitudeString) {
    throw new Error("Preencha todos os campos obrigatórios.");
  }

  const latitude = parseFloat(latitudeString);
  const longitude = parseFloat(longitudeString);

  await prisma.cidade.update({
    where: { id },
    data: {
      nome,
      estado,
      pais,
      latitude,
      longitude,
    },
  });

  revalidatePath("/admin/cidades");
}