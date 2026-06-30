import FiltroCategoria from "@/components/FiltroCategoria";
import CardEstabelecimento from "@/components/CardEstabelecimento";
import BarraDeBusca from "@/components/BarraDeBusca";
import FiltroCidade from "@/components/FiltroCidade";
import { prisma } from "@/app/lib/prisma";
import MapaExplorarClient from "@/components/MapaExplorarClient";
import { getServerSession } from "next-auth";
import BotaoFavorito from "@/components/BotaoFavorito";

type PaginaExplorarProps = {
  searchParams: Promise<{
    q?: string | string[];
    cidade?: string | string[];
    categoria?: string | string[];
  }>;
};

export default async function PaginaExplorar({ searchParams }: PaginaExplorarProps) {
  const session = await getServerSession();
  
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

  let meusFavoritosIds: number[] = [];
  if (session?.user?.email) {
    const usuario = await prisma.usuario.findUnique({
      where: { email: session.user.email },
      include: { favoritos: { select: { id: true } } }
    });
    meusFavoritosIds = usuario?.favoritos.map((f: any) => f.id) ?? [];
  }

  // Define o centro do mapa
  let latCidade = -21.1356; 
  let lngCidade = -44.2612;

  if (estabelecimentos.length > 0) {
    const primeiroComCoordenadas = estabelecimentos.find(
      ((e: any) => e.latitude !== null && e.longitude !== null)
    );

    if (primeiroComCoordenadas?.latitude && primeiroComCoordenadas?.longitude) {
      latCidade = Number(primeiroComCoordenadas.latitude);
      lngCidade = Number(primeiroComCoordenadas.longitude);
    }
  }

  const categorias = categoriasBanco
    .map((item: any) => item.categoria)
    .sort((categoriaA: any, categoriaB: any) => categoriaA.localeCompare(categoriaB));

  const locaisParaOMapa = estabelecimentos.map((est: any) => ({
    id: est.id,
    nome: est.nome,
    categoria: est.categoria,
    latitude: est.latitude ? Number(est.latitude) : null,
    longitude: est.longitude ? Number(est.longitude) : null,
    imagemUrl: est.imagemUrl,
  }));

  return (
    /* 🛠️ ALTERADO: w-full e max-w-none removem as barras brancas laterais. 
       px-4 e py-4 deixam os cantos mais próximos das bordas do monitor */
    <div className="w-full max-w-none px-4 py-4 space-y-4 h-[calc(100vh-64px)] flex flex-col overflow-hidden">
      
      {/* Container Superior: Barra de Busca + Filtros alinhados em linha fluida */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between bg-white p-2 rounded-xl shadow-sm border border-slate-100">
        <div className="flex-1 min-w-0">
          <BarraDeBusca
            termoBusca={termoBusca}
            cidadeSelecionada={cidadeIdValida ? cidadeSelecionada : ""}
            categoriaSelecionada={categoriaSelecionada}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 min-w-0">
          <FiltroCidade
            cidades={cidades}
            cidadeSelecionada={cidadeIdValida ? cidadeSelecionada : ""}
          />
          <FiltroCategoria
            categorias={categorias}
            categoriaSelecionada={categoriaSelecionada}
          />
        </div>
      </div>

      {/* LAYOUT SPLIT-SCREEN FLUIDO (Ocupando todo o espaço restante) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
        
        {/* Coluna da Esquerda: Cards (Ocupa 4 de 12 partes da largura ~ 33%) */}
        <section className="lg:col-span-4 overflow-y-auto pr-1 h-full space-y-4 scrollbar-thin">
          <div className="grid grid-cols-1 gap-4">
            {estabelecimentos.length === 0 ? (
              <p className="text-center text-[var(--text-on-light)] text-lg mt-10">
                {termoBusca
                  ? `Nenhum estabelecimento encontrado para "${termoBusca}".`
                  : "Nenhum estabelecimento aprovado encontrado."}
              </p>
            ) : (
              estabelecimentos.map((estabelecimento: any) => (
                <CardEstabelecimento
                  key={estabelecimento.id}
                  id={estabelecimento.id}
                  nome={estabelecimento.nome}
                  categoria={estabelecimento.categoria}
                  avaliacao={estabelecimento.mediaNota}
                  imagem={estabelecimento.imagemUrl ?? "/globe.svg"}
                  isAdmin={false}
                >
                  <BotaoFavorito 
                    id={estabelecimento.id} 
                    ehFavorito={meusFavoritosIds.includes(estabelecimento.id)}
                    email={session?.user?.email ?? undefined}
                  />
                </CardEstabelecimento>
              ))
            )}
          </div>
        </section>

        {/* Coluna da Direita: Mapa Gigante (Ocupa 8 de 12 partes da largura ~ 66%) */}
        <section className="hidden lg:block lg:col-span-8 h-full rounded-xl overflow-hidden relative">
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