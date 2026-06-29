"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises"; 
import path from "node:path";

export async function criarEstabelecimento(formData: FormData) {
  const nome = formData.get("nome") as string;
  const descricao = formData.get("descricao") as string;
  const categoria = formData.get("categoria") as string;
  const cep = formData.get("cep") as string;
  const rua = formData.get("rua") as string;
  const bairro = formData.get("bairro") as string;
  const numero = formData.get("numero") as string;
  const latitudeString = formData.get("latitude") as string;
  const longitudeString = formData.get("longitude") as string;
  
  // Opcionais
  const complemento = formData.get("complemento") as string;
  const telefone = formData.get("telefone") as string;
  const url = formData.get("url") as string;
  
  const proprietarioEmail = formData.get("proprietarioEmail") as string;
  const cidadeIdString = formData.get("cidadeId") as string;

  const arquivoImagem = formData.get("imagem") as File | null;

  if (!nome || !descricao || !categoria || !cep || !rua || !bairro || !numero || !cidadeIdString) {
    throw new Error("Preencha todos os campos obrigatórios.");
  }

  const cidadeId = parseInt(cidadeIdString);
  const latitude = latitudeString ? parseFloat(latitudeString) : null;
  const longitude = longitudeString ? parseFloat(longitudeString) : null;
  let imagemUrl: string | null = null;

  if (arquivoImagem && arquivoImagem.size > 0 && arquivoImagem.name !== "undefined") {
    try {
      const limiteTamanho = 5 * 1024 * 1024; // 5MB
      if (arquivoImagem.size > limiteTamanho) {
        throw new Error("A imagem é muito grande. O limite máximo é 4MB.");
      }

      const arrayBuffer = await arquivoImagem.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const pastaUploads = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(pastaUploads, { recursive: true });

      const nomeLimpo = arquivoImagem.name.replace(/[^a-zA-Z0-0.]/g, "_");
      const nomeArquivoUnico = `${Date.now()}-${nomeLimpo}`;
      const caminhoCompletoDoArquivo = path.join(pastaUploads, nomeArquivoUnico);

      await fs.writeFile(caminhoCompletoDoArquivo, buffer);
      imagemUrl = `/uploads/${nomeArquivoUnico}`;

    } catch (error: any) {
      console.error("Erro no upload:", error);
      throw new Error(error.message || "Falha ao processar o upload da imagem.");
    }
  }

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
      imagemUrl,
      latitude,
      longitude,
    },
  });

  revalidatePath("/perfil");
}

export async function listarMeusEstabelecimentos(email: string) {
  if (!email) return [];
  return await prisma.estabelecimento.findMany({
    where: { proprietarioEmail: email },
    include: { cidade: true },
    orderBy: { criadoEm: "desc" },
  });
}

export async function deletarMeuEstabelecimento(id: number, email: string) {
  if (!id || !email) throw new Error("Dados inválidos.");

  const estabelecimento = await prisma.estabelecimento.findUnique({ where: { id } });
  
  if (estabelecimento?.proprietarioEmail !== email) {
    throw new Error("Você não tem permissão para excluir este estabelecimento.");
  }

  await prisma.estabelecimento.delete({ where: { id } });
  
  revalidatePath("/perfil/estabelecimentos");
  revalidatePath("/admin/estabelecimentos");
}

export async function editarEstabelecimento(id: number, formData: FormData, email: string) {
  const nome = formData.get("nome") as string;
  const descricao = formData.get("descricao") as string;
  const categoria = formData.get("categoria") as string;
  const cep = formData.get("cep") as string;
  const rua = formData.get("rua") as string;
  const bairro = formData.get("bairro") as string;
  const numero = formData.get("numero") as string;
  const complemento = formData.get("complemento") as string;
  const telefone = formData.get("telefone") as string;
  const url = formData.get("url") as string;
  const cidadeIdString = formData.get("cidadeId") as string;
  const latitudeString = formData.get("latitude") as string;
  const longitudeString = formData.get("longitude") as string;
  
  const arquivoImagem = formData.get("imagem") as File | null;

  const estabelecimento = await prisma.estabelecimento.findUnique({ where: { id } });
  if (estabelecimento?.proprietarioEmail !== email) {
    throw new Error("Você não tem permissão para alterar este estabelecimento.");
  }

  let imagemUrl = estabelecimento.imagemUrl; 

  if (arquivoImagem && arquivoImagem.size > 0 && arquivoImagem.name !== "undefined") {
    const arrayBuffer = await arquivoImagem.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pastaUploads = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(pastaUploads, { recursive: true });
    
    const nomeLimpo = arquivoImagem.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const nomeArquivoUnico = `${Date.now()}-${nomeLimpo}`;
    await fs.writeFile(path.join(pastaUploads, nomeArquivoUnico), buffer);
    
    imagemUrl = `/uploads/${nomeArquivoUnico}`;
  }

  const cidadeId = parseInt(cidadeIdString);
  const latitude = latitudeString ? parseFloat(latitudeString) : null;
  const longitude = longitudeString ? parseFloat(longitudeString) : null;

  await prisma.estabelecimento.update({
    where: { id },
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
      imagemUrl, 
      aprovado: false,
      latitude,
      longitude, 
    },
  });

  revalidatePath("/perfil/estabelecimentos");
  revalidatePath("/admin/estabelecimentos");
  revalidatePath("/explorar");
}