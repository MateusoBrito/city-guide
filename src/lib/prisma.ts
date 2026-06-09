import { PrismaClient } from '@prisma/client'

const prismaRaw = new PrismaClient()

async function atualizarMediaEstabelecimento(estabelecimentoId: number) {
  const agregacao = await prismaRaw.avaliacao.aggregate({
    where: { 
      estabelecimentoId: estabelecimentoId,
      aprovada: true  
    }, _avg: { nota: true }, _count: { nota: true }
  });

  const novaMedia = agregacao._avg.nota || 0;
  const totalAvaliacoes = agregacao._count.nota || 0;

  await prismaRaw.estabelecimento.update({
    where: { id: estabelecimentoId },
    data: {
      mediaNota: novaMedia,
      numAvaliacoes: totalAvaliacoes
    }
  });
}

export const prisma = prismaRaw.$extends({
  query: {
    avaliacao: {
      // 1. CREATE: O ID sempre vem nos dados enviados (args.data)
      async create({ args, query }) {
        const novaAvaliacao = await query(args) as any;
        if (novaAvaliacao?.estabelecimentoId) await atualizarMediaEstabelecimento(novaAvaliacao.estabelecimentoId);
        return novaAvaliacao;
      },

      // 2. UPDATE: O ID pode estar no "where" se a query usou a chave composta
      async update({ args, query }) {
        const avaliacaoAtualizada = await query(args) as any;
        // Tenta pegar do resultado ou do 'where' da query original
        const estabelecimentoId = avaliacaoAtualizada?.estabelecimentoId || args.where?.estabelecimentoId;
        if(estabelecimentoId) await atualizarMediaEstabelecimento(estabelecimentoId);
        return avaliacaoAtualizada;
      },

      // 3. DELETE: 
      async delete({ args, query }) {
        const avaliacaoDeletada = await query(args) as any;
        const estabelecimentoId = avaliacaoDeletada?.estabelecimentoId || args.where?.estabelecimentoId;
        if(estabelecimentoId) await atualizarMediaEstabelecimento(estabelecimentoId);
        return avaliacaoDeletada;
      }
    }
  }
});