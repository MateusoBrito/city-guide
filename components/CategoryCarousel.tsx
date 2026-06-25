"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categorias = [
  "Todos",
  "Restaurante",
  "Cafeteria",
  "Hotel",
  "Turismo",
  "Bar",
  "Lanchonete",
  "Padaria",
  "Sorveteria",
  "Pizzaria",
];

export default function CategoryCarousel() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");

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
        {categorias.map((categoria) => (
          <button
            key={categoria}
            onClick={() => setCategoriaAtiva(categoria)}
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
        className="
          flex-shrink-0
          p-2
          rounded-full
          bg-[var(--secondary)]
          text-white
          shadow-md
          hover:bg-[var(--secondary-hover)]
          transition
        "
      >
        <ChevronRight size={20} />
      </button>

    </div>
  );
}