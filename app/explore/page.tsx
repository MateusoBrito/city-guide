"use client";

import { Search } from "lucide-react";
import { Heart } from "lucide-react";
import { ChevronDown } from "lucide-react";
import CategoryCarousel from "@/components/CategoryCarousel";

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-8 space-y-4">
        
        {/* Busca */}
        <section>
            <div className="relative">
            <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/80"
                size={20}
            />

            <input
                type="text"
                placeholder="Qual lugar você está procurando?"
                className="w-full rounded-lg bg-[var(--secondary)] py-3 pl-12 pr-4 text-[var(--text-on-dark)] outline-none placeholder:text-white/80"
            />
            </div>
        </section>

        {/* Filtros */}
        <section className="flex flex-col min-w-0 md:flex-row gap-4">
            <div className="relative">
                <select
                className="w-full md:w-auto bg-[var(--secondary)] text-[var(--text-on-dark)] rounded-lg py-3 px-4 pr-10 appearance-none outline-none focus:outline-none cursor-pointer"
                >
                <option>Todas as cidades</option>
                </select>

                <ChevronDown
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-on-dark)] pointer-events-none"
                />
            </div>
            
            <CategoryCarousel/>
        </section>

        {/* Estabelecimentos */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-black/25 rounded-lg px-8 py-6 shadow-xl space-y-3">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-[var(--secondary)] leading-tight">
                        Nome do Estabelecimento
                    </h3>
                    <p className="text-sm text-[var(--text-on-light)]">
                        Categoria
                    </p>
                    </div>

                    <Heart
                    size={30}
                    className="text-[var(--secondary)]"
                    />
                </div>

                <img
                    src="/placeholder.jpg"
                    alt="Imagem do Estabelecimento"
                    className="w-full h-40 object-cover rounded-lg"
                />

                <div className="flex justify-between items-center">
                    <div>
                    <p className="text-[var(--secondary)] font-medium">
                        Avaliação Geral
                    </p>
                    <p className="text-yellow-400">★★★★☆</p>
                    </div>

                    <button className="bg-[var(--secondary)] text-[var(--text-on-dark)] px-4 py-2 rounded-lg shadow-lg hover:bg-[var(--secondary-hover)]">
                    Ver Detalhes
                    </button>
                </div>
            </div>
        </section>

    </div>
  );
}