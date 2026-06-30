"use client";

import { Star } from "lucide-react";

type EstrelasDeAvaliacaoProps = {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: number;
};

export default function EstrelasDeAvaliacao({
  value,
  onChange,
  readOnly = false,
  size = 22,
}: EstrelasDeAvaliacaoProps) {
  return (
    <div className="flex items-center gap-1" aria-label={`${value} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((nota) => {
        const selecionada = nota <= value;

        if (readOnly) {
          return (
            <Star
              key={nota}
              size={size}
              className={
                selecionada
                  ? "fill-[#2E948A] text-[#2E948A]"
                  : "text-slate-300"
              }
            />
          );
        }

        return (
          <button
            key={nota}
            type="button"
            onClick={() => onChange?.(nota)}
            className="rounded p-0.5 text-[#2E948A] transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#2E948A]"
            aria-label={`Selecionar ${nota} estrela${nota > 1 ? "s" : ""}`}
          >
            <Star
              size={size}
              className={selecionada ? "fill-current" : "text-slate-300"}
            />
          </button>
        );
      })}
    </div>
  );
}
