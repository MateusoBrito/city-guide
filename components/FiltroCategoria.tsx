"use client";

import { useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

type FiltroCategoriaProps = {
  categorias: string[];
  categoriaSelecionada: string;
};

export default function FiltroCategoria({
  categorias,
  categoriaSelecionada,
}: FiltroCategoriaProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollEsquerda = () => {
    scrollRef.current?.scrollBy({
      left: -250,
      behavior: "smooth",
    });
  };

  const scrollDireita = () => {
    scrollRef.current?.scrollBy({
      left: 250,
      behavior: "smooth",
    });
  };

  function atualizarCategoria(categoria: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (categoria === "Todos") {
      params.delete("categoria");
    } else {
      params.set("categoria", categoria);
    }

    const queryString = params.toString();
    router.replace(queryString ? `/explorar?${queryString}` : "/explorar");
  }

  const categoriasComTodos = ["Todos", ...categorias];
  const categoriaAtiva = categoriaSelecionada || "Todos";

  return (
    <div className="flex items-center gap-3 w-full min-w-0">

      <button
        onClick={scrollEsquerda}
        className="flex-shrink-0 p-2 rounded-full bg-[var(--secondary)] text-white shadow-md hover:bg-[var(--secondary-hover)] transition"
      >
        <ChevronLeft size={20} />
      </button>

      <div
        ref={scrollRef}
        className="flex-1 min-w-0 flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
      >
        {categoriasComTodos.map((categoria) => (
          <button
            key={categoria}
            type="button"
            onClick={() => atualizarCategoria(categoria)}
            className={`
              whitespace-nowrap
              px-5 py-2
              rounded-full
              transition-all
              duration-200
              flex-shrink-0

              ${
                categoriaAtiva === categoria
                  ? "bg-[var(--secondary)] text-white shadow-lg"
                  : "bg-white border border-[var(--border)] text-[var(--text-on-light)] hover:border-[var(--secondary)]"
              }
            `}
          >
            {categoria}
          </button>
        ))}
      </div>

      <button
        onClick={scrollDireita}
        className="flex-shrink-0 p-2 rounded-full bg-[var(--secondary)] text-white shadow-md hover:bg-[var(--secondary-hover)] transition"
      >
        <ChevronRight size={20} />
      </button>

    </div>
  );
}
