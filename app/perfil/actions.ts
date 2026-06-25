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
  let imagemUrl: string | null = null;

  // Lógica para processar e salvar o arquivo
  if (arquivoImagem && arquivoImagem.size > 0 && arquivoImagem.name !== "undefined") {
    try {
      // 1. Validação de tamanho máximo (Ex: Bloquear se for maior que 4MB)
      const limiteTamanho = 4 * 1024 * 1024; // 4MB
      if (arquivoImagem.size > limiteTamanho) {
        throw new Error("A imagem é muito grande. O limite máximo é 4MB.");
      }

      // 2. Transforma em buffer de forma simplificada
      const arrayBuffer = await arquivoImagem.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const pastaUploads = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(pastaUploads, { recursive: true });

      // Normaliza o nome removendo caracteres especiais
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

  // Salvando no banco de dados com a nova URL de imagem
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
    },
  });

  revalidatePath("/perfil");
}