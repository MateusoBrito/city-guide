"use server";

import {prisma} from "@/app/lib/prisma";
import {revalidatePath} from "next/cache";

export async function criarEstabelecimento(formData: FormData) {
  const nome = formData.get("nome") as string;
  const descricao = formData.get("descricao") as string;
  const categoria = formData.get("categoria") as string;
  const cep = formData.get("cep") as string;
  const rua = formData.get("rua") as string;
  const bairro = formData.get("bairro") as string;
  const numero = formData.get("numero") as string;
  
  // Dados opcionais
  const complemento = formData.get("complemento") as string;
  const telefone = formData.get("telefone") as string;
  const url = formData.get("url") as string;
  
  const proprietarioEmail = formData.get("proprietarioEmail") as string;
  const cidadeIdString = formData.get("cidadeId") as string;

  if (!nome || !descricao || !categoria || !cep || !rua || !bairro || !numero || !cidadeIdString) {
    throw new Error("Preencha todos os campos obrigatórios.");
  }

  // conversão do id da cidade
  const cidadeId = parseInt(cidadeIdString);

// salvando no banco
  await prisma.estabelecimento.create({
    data: {
      nome,
      descricao,
      categoria,
      cep,
      rua,
      bairro,
      numero,
      complemento,
      telefone,
      url,
      cidadeId,
      proprietarioEmail,
    },
  });

  revalidatePath("/perfil");
}