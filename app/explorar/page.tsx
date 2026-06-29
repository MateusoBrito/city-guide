import FiltroCategoria from "@/components/FiltroCategoria";
import CardEstabelecimento from "@/components/CardEstabelecimento";
import BarraDeBusca from "@/components/BarraDeBusca";
import FiltroCidade from "@/components/FiltroCidade";
import prisma from "@/app/lib/prisma";
import MapaExplorarClient from "@/components/MapaExplorarClient";

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
  const cidadeParam = Array.isArray(params.cidade) ? params.cidade[0] : params.cidade;
  const categoriaParam = Array.isArray(params.categoria) ? params.categoria[0] : params.categoria;

  const termoBusca = termoBuscaParam?.trim() ?? "";
  const cidadeSelecionada = cidadeParam?.trim() ?? "";
  const categoriaSelecionada = categoriaParam?.trim() ?? "";
  const cidadeId = Number(cidadeSelecionada);
  const cidadeIdValida = Number.isInteger(cidadeId) && cidadeId > 0;

  // Buscas paralelas no banco de dados
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
      where: { aprovado: true },
      distinct: ["categoria"],
      select: { categoria: true },
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
    }),
  ]);

  // Define o centro do mapa
  let latCidade = -21.1356; 
  let lngCidade = -44.2612;

  if (estabelecimentos.length > 0) {
    const primeiroComCoordenadas = estabelecimentos.find(
      (e) => e.latitude !== null && e.longitude !== null
    );

    if (primeiroComCoordenadas?.latitude && primeiroComCoordenadas?.longitude) {
      latCidade = Number(primeiroComCoordenadas.latitude);
      lngCidade = Number(primeiroComCoordenadas.longitude);
    }
  }

  const categorias = categoriasBanco
    .map((item) => item.categoria)
    .sort((categoriaA, categoriaB) => categoriaA.localeCompare(categoriaB));

  const locaisParaOMapa = estabelecimentos.map((est) => ({
    id: est.id,
    nome: est.nome,
    categoria: est.categoria,
    latitude: est.latitude ? Number(est.latitude) : null,
    longitude: est.longitude ? Number(est.longitude) : null,
    imagemUrl: est.imagemUrl,
  }));

  return (
    <div className="mx-auto max-w-7xl px-8 py-8 space-y-4 h-screen flex flex-col">
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

      {/* LAYOUT SPLIT-SCREEN COM MAPA MAIOR 🎯 */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0 overflow-hidden pt-2">
        
        {/* Coluna da Esquerda: Ocupa 2 de 5 colunas (antes ocupava 3) */}
        <section className="lg:col-span-2 overflow-y-auto pr-2 h-full space-y-4 scrollbar-thin">
          {/* Mudado aqui: tiramos o md:grid-cols-2 para fixar apenas 1 coluna de cards */}
          <div className="grid grid-cols-1 gap-6">
            {estabelecimentos.length === 0 ? (
              <p className="text-center text-[var(--text-on-light)] text-lg mt-10">
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
          </div>
        </section>

        {/* Coluna da Direita: Agora assume 3 de 5 colunas (o mapa ganhou muito mais largura!) */}
        <section className="hidden lg:block lg:col-span-3 h-full rounded-xl overflow-hidden sticky top-0">
          <MapaExplorarClient
            latitudeCidade={latCidade}
            longitudeCidade={lngCidade}
            estabelecimentos={locaisParaOMapa}
          />
        </section>
      </div>
    </div>
  );
}