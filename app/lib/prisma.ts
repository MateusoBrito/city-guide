import { PrismaClient } from '@prisma/client'

// 1. Inicializa o cliente bruto do Prisma conectado ao MySQL
const prismaRaw = new PrismaClient()

// 2. Função isolada que calcula a média e atualiza o estabelecimento
async function atualizarMediaEstabelecimento(estabelecimentoId: number) {
  const agregacao = await prismaRaw.avaliacao.aggregate({
    where: { 
      estabelecimentoId: estabelecimentoId,
      aprovada: true  
    }, 
    _avg: { nota: true }, 
    _count: { nota: true }
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

// 3. Cria e exporta a instância estendida com os gatilhos automáticos
export const prisma = prismaRaw.$extends({
  query: {
    avaliacao: {
      // Executado ao criar uma avaliação
      async create({ args, query }) {
        const novaAvaliacao = await query(args) as any;
        if (novaAvaliacao?.estabelecimentoId) await atualizarMediaEstabelecimento(novaAvaliacao.estabelecimentoId);
        return novaAvaliacao;
      },

      // Executado ao atualizar uma avaliação (ex: mudar nota ou aprovar)
      async update({ args, query }) {
        const avaliacaoAtualizada = await query(args) as any;
        const estabelecimentoId = avaliacaoAtualizada?.estabelecimentoId || args.where?.estabelecimentoId;
        if(estabelecimentoId) await atualizarMediaEstabelecimento(estabelecimentoId);
        return avaliacaoAtualizada;
      },

      // Executado ao apagar uma avaliação
      async delete({ args, query }) {
        const avaliacaoDeletada = await query(args) as any;
        const estabelecimentoId = avaliacaoDeletada?.estabelecimentoId || args.where?.estabelecimentoId;
        if(estabelecimentoId) await atualizarMediaEstabelecimento(estabelecimentoId);
        return avaliacaoDeletada;
      }
    }
  }
});

export default prisma;