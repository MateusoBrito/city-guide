"use client";

import { ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

type Cidade = {
  id: number;
  nome: string;
  estado: string;
};

type FiltroCidadeProps = {
  cidades: Cidade[];
  cidadeSelecionada: string;
};

export default function FiltroCidade({
  cidades,
  cidadeSelecionada,
}: FiltroCidadeProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function atualizarCidade(event: ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    const cidadeId = event.target.value;

    if (cidadeId) {
      params.set("cidade", cidadeId);
    } else {
      params.delete("cidade");
    }

    const queryString = params.toString();
    router.replace(queryString ? `/explorar?${queryString}` : "/explorar");
  }

  return (
    <div className="relative">
      <select
        value={cidadeSelecionada}
        onChange={atualizarCidade}
        className="w-full md:w-auto bg-[var(--secondary)] text-[var(--text-on-dark)] rounded-lg py-3 px-4 pr-10 appearance-none outline-none focus:outline-none cursor-pointer"
      >
        <option value="">Todas as cidades</option>
        {cidades.map((cidade) => (
          <option key={cidade.id} value={cidade.id}>
            {cidade.nome} - {cidade.estado}
          </option>
        ))}
      </select>

      <ChevronDown
        size={18}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-on-dark)] pointer-events-none"
      />
    </div>
  );
}
