// app/admin/relatorios/page.tsx
import { gerarRelatorioRanking } from "./actions";

export default async function RelatoriosPage() {
  const ranking = await gerarRelatorioRanking();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#24504F]">Relatórios do Sistema</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Ranking de Estabelecimentos (Top 10)</h2>
        <p className="text-sm text-slate-500 mb-6">
          Os melhores locais avaliados na plataforma, cruzando dados de cidades e engajamento (favoritos).
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-3 font-semibold rounded-tl-lg">Posição</th>
                <th className="p-3 font-semibold">Estabelecimento</th>
                <th className="p-3 font-semibold">Cidade/UF</th>
                <th className="p-3 font-semibold">Nota Média</th>
                <th className="p-3 font-semibold">Qtd. Avaliações</th>
                <th className="p-3 font-semibold rounded-tr-lg">Favoritos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ranking.map((local, index) => (
                <tr key={local.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-[#2E948A]">#{index + 1}</td>
                  <td className="p-3 font-medium text-slate-800">{local.nome}</td>
                  <td className="p-3 text-slate-600">{local.cidade.nome} - {local.cidade.estado}</td>
                  <td className="p-3">
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded-md">
                      ★ {local.mediaNota.toFixed(1)}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600">{local.numAvaliacoes}</td>
                  <td className="p-3 text-slate-600 flex items-center gap-1">
                    ❤️ {local._count.favoritadoPor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}