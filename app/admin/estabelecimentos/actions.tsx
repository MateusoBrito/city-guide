"use server";

import {prisma} from "@/app/lib/prisma";
import {revalidatePath} from "next/cache";

export async function listarEstabelecimentosPendentes(){
    return await prisma.estabelecimento.findMany({
        where:{aprovado:false,},
        include: {cidade: true,  proprietario: true, },
        orderBy:{id: "desc",}
    })
}


export async function listarEstabelecimentosAprovados(){
    return await prisma.estabelecimento.findMany({
        where: { aprovado: true },
        include: { cidade: true, proprietario: true },
        orderBy: { nome: "asc" } 
    });
}

export async function aprovarEstabelecimento(id: number) {
  if (!id) throw new Error("ID inválido.");
  await prisma.estabelecimento.update({
    where: { id },
    data: { aprovado: true },
  });
  revalidatePath("/admin/estabelecimentos");
  revalidatePath("/explorar"); 
}

export async function recusarEstabelecimento(id: number) {
  if (!id) throw new Error("ID inválido.");
  await prisma.estabelecimento.delete({
    where: { id },
  });
  revalidatePath("/admin/estabelecimentos");
  revalidatePath("/explorar"); 
}