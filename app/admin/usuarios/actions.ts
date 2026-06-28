"use server";

import {prisma} from "@/app/lib/prisma";
import {revalidatePath} from "next/cache";

export async function listarUsuarios() {
  try {
    const usuarios = await prisma.usuario.findMany({
      orderBy: { nome: 'asc' }, // ordem alfabetica
    });
    return usuarios;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return [];
  }
}

type TipoUsuario = "usuario" | "visitante" | "admin";

export async function atualizarTipoUsuario(email: string, novoTipo: TipoUsuario) {
  try {
    await prisma.usuario.update({
      where: {email},
      data: { tipo: novoTipo },
    });
    
    revalidatePath("/admin/usuarios");
    return { sucesso: true };
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw new Error("Não foi possível atualizar o nível de acesso.");
  }
}

export async function deletarUsuario(email: string) {
  try {
    await prisma.$transaction([ //prisma apaga em ordem, se der erro desfaz tudo
      prisma.avaliacao.deleteMany({
        where: { usuarioEmail: email }, 
      }),
      
      prisma.estabelecimento.deleteMany({
        where: { proprietarioEmail: email },
      }),
      
      prisma.usuario.delete({
        where: { email },
      })
    ]);

    revalidatePath("/admin/usuarios");
    return { sucesso: true };
  } catch (error) {
    console.error("Erro ao deletar usuário em cascata:", error);
    throw new Error("Erro ao deletar a conta e os registros do usuário.");
  }
}