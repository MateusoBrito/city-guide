import FiltroCategoria from "@/components/FiltroCategoria";
import CardEstabelecimento from "@/components/CardEstabelecimento";
import BarraDeBusca from "@/components/BarraDeBusca";
import FiltroCidade from "@/components/FiltroCidade";
import prisma from "@/app/lib/prisma";

type PaginaExplorarProps = {
  searchParams: Promise<{
    q?: string | string[];
    cidade?: string | string[];
    categoria?: string | string[];
  }>;
};

export default async function PaginaExplorar({ searchParams }: PaginaExplorarProps) {
  const params = await searchParams;
  const termoBuscaParam = Array.isArray(params.q) ? params.q[0] : params.q;
  const cidadeParam = Array.isArray(params.cidade)
    ? params.cidade[0]
    : params.cidade;
  const categoriaParam = Array.isArray(params.categoria)
    ? params.categoria[0]
    : params.categoria;
  const termoBusca = termoBuscaParam?.trim() ?? "";
  const cidadeSelecionada = cidadeParam?.trim() ?? "";
  const categoriaSelecionada = categoriaParam?.trim() ?? "";
  const cidadeId = Number(cidadeSelecionada);
  const cidadeIdValida = Number.isInteger(cidadeId) && cidadeId > 0;

  const [cidades, categoriasBanco, estabelecimentos] = await Promise.all([
    prisma.cidade.findMany({
      orderBy: [{ nome: "asc" }, { estado: "asc" }],
      select: {
        id: true,
        nome: true,
        estado: true,
      },
    }),
    prisma.estabelecimento.findMany({
      where: {
        aprovado: true,
      },
      distinct: ["categoria"],
      select: {
        categoria: true,
      },
    }),
    prisma.estabelecimento.findMany({
      where: {
        aprovado: true,
        ...(cidadeIdValida ? { cidadeId } : {}),
        ...(categoriaSelecionada ? { categoria: categoriaSelecionada } : {}),
        ...(termoBusca
          ? {
              OR: [
                { nome: { contains: termoBusca } },
                { categoria: { contains: termoBusca } },
                { descricao: { contains: termoBusca } },
              ],
            }
          : {}),
      },
      orderBy: { mediaNota: "desc" },
      select: {
        id: true,
        nome: true,
        categoria: true,
        mediaNota: true,
        imagemUrl: true,
      },
    }),
  ]);

  const categorias = categoriasBanco
    .map((item) => item.categoria)
    .sort((categoriaA, categoriaB) => categoriaA.localeCompare(categoriaB));

  return (
    <div className="mx-auto max-w-7xl px-8 py-8 space-y-4">
      {/* Busca */}
      <section>
        <BarraDeBusca
          termoBusca={termoBusca}
          cidadeSelecionada={cidadeIdValida ? cidadeSelecionada : ""}
          categoriaSelecionada={categoriaSelecionada}
        />
      </section>

      {/* Filtros */}
      <section className="flex flex-col min-w-0 md:flex-row gap-4">
        <FiltroCidade
          cidades={cidades}
          cidadeSelecionada={cidadeIdValida ? cidadeSelecionada : ""}
        />

        <FiltroCategoria
          categorias={categorias}
          categoriaSelecionada={categoriaSelecionada}
        />
      </section>

      {/* Estabelecimentos */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {estabelecimentos.length === 0 ? (
          <p className="md:col-span-2 lg:col-span-3 text-center text-[var(--text-on-light)] text-lg mt-10">
            {termoBusca
              ? `Nenhum estabelecimento encontrado para "${termoBusca}".`
              : "Nenhum estabelecimento aprovado encontrado."}
          </p>
        ) : (
          estabelecimentos.map((estabelecimento) => (
            <CardEstabelecimento
              key={estabelecimento.id}
              nome={estabelecimento.nome}
              categoria={estabelecimento.categoria}
              avaliacao={estabelecimento.mediaNota}
              imagem={estabelecimento.imagemUrl ?? "/globe.svg"}
            />
          ))
        )}
      </section>
    </div>
  );
}