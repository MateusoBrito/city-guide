"use client";

import { useRouter } from "next/navigation";
import { Filter } from "lucide-react";

type FiltroRankingProps = {
  categorias: string[];
  categoriaSelecionada: string;
};

export default function FiltroRanking({ categorias, categoriaSelecionada }: FiltroRankingProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
      <Filter size={16} className="text-slate-400" />
      <label htmlFor="categoria" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
        Categoria:
      </label>
      <select
        id="categoria"
        value={categoriaSelecionada}
        onChange={(e) => {
          const novaCategoria = e.target.value;
          {/*altera a URL do navegador*/}
          router.push(`/admin/relatorios/ranking?categoria=${encodeURIComponent(novaCategoria)}`);
        }}
        className="bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2E948A]/20 focus:border-[#2E948A] cursor-pointer"
      >
        <option value="Todas">Todas as Categorias</option>
        {categorias.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}