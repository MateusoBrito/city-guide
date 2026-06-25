"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

type BarraDeBuscaProps = {
  termoBusca: string;
  cidadeSelecionada: string;
  categoriaSelecionada: string;
};

export default function BuscaExplorar({
  termoBusca,
  cidadeSelecionada,
  categoriaSelecionada,
}: BarraDeBuscaProps) {
  const router = useRouter();

  function limparBuscaQuandoInputFicarVazio(
    event: FormEvent<HTMLInputElement>
  ) {
    if (termoBusca && event.currentTarget.value === "") {
      const params = new URLSearchParams();

      if (cidadeSelecionada) params.set("cidade", cidadeSelecionada);
      if (categoriaSelecionada) params.set("categoria", categoriaSelecionada);

      const queryString = params.toString();
      router.replace(queryString ? `/explorar?${queryString}` : "/explorar");
    }
  }

  return (
    <form action="/explorar" className="flex flex-col gap-3 md:flex-row">
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white"
          size={20}
        />

        <input
          type="search"
          name="q"
          defaultValue={termoBusca}
          placeholder="Qual lugar voce esta procurando?"
          onInput={limparBuscaQuandoInputFicarVazio}
          className="search-input w-full rounded-lg bg-[var(--secondary)] py-3 pl-12 pr-4 text-[var(--text-on-dark)] outline-none placeholder:text-white/80"
        />
      </div>

      {cidadeSelecionada ? (
        <input type="hidden" name="cidade" value={cidadeSelecionada} />
      ) : null}

      {categoriaSelecionada ? (
        <input type="hidden" name="categoria" value={categoriaSelecionada} />
      ) : null}

      <button
        type="submit"
        className="rounded-lg bg-[var(--secondary)] px-5 py-3 text-[var(--text-on-dark)] shadow-lg transition-colors hover:bg-[var(--secondary-hover)]"
      >
        Buscar
      </button>
    </form>
  );
}
