import { gerarRelatorioRanking, buscarCategoriasDisponiveis } from "./actions";
import { Trophy } from "lucide-react";
import FiltroRanking from "@/components/FiltroRanking"; 

type Props = {
  searchParams: Promise<{ categoria?: string }>; //le a url do navegador pra pegar a categoria
};

export default async function RelatorioRankingPage({ searchParams }: Props) {
  const params = await searchParams;
  const categoriaSelecionada = params.categoria ?? "Todas";

  const [ranking, categorias] = await Promise.all([
    gerarRelatorioRanking(categoriaSelecionada),
    buscarCategoriasDisponiveis()
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#24504F] flex items-center gap-2">
            <Trophy className="text-[#2E948A]" /> Ranking de Estabelecimentos
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Análise dos 10 locais de maior destaque na plataforma.
          </p>
        </div>

        <FiltroRanking 
          categorias={categorias} 
          categoriaSelecionada={categoriaSelecionada} 
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {ranking.length === 0 ? (
          <div className="p-10 text-center text-slate-500 italic">
            Nenhum estabelecimento encontrado para a categoria &quot;{categoriaSelecionada}&quot;.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-semibold w-20">Posição</th>
                  <th className="p-4 font-semibold">Estabelecimento</th>
                  <th className="p-4 font-semibold">Cidade / Estado</th>
                  <th className="p-4 font-semibold">Nota Média</th>
                  <th className="p-4 font-semibold text-center">Total de Avaliações</th>
                  <th className="p-4 font-semibold text-center">Favoritos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ranking.map((local, index) => (
                  <tr key={local.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-4 font-black text-lg text-[#2E948A]">#{index + 1}</td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{local.nome}</div>
                      <div className="text-xs text-slate-400 font-medium">{local.categoria}</div>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">
                      {local.cidade.nome} — {local.cidade.estado}
                    </td>
                    <td className="p-4">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1 shadow-sm">
                        ★ {local.mediaNota.toFixed(1)}
                      </span>
                    </td>
                    <td className="p-4 text-center text-slate-600 font-semibold">{local.numAvaliacoes}</td>
                    <td className="p-4 text-center text-slate-500 font-medium group-hover:text-red-500 transition-colors">
                      ❤️ {local._count.favoritadoPor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}