"use client";

import { Search, Heart, ChevronDown } from "lucide-react";
import CategoryCarousel from "@/components/CategoryCarousel";
import { useEffect, useState } from "react";
import { listarCidades } from "@/app/admin/cidades/actions";

export default function ExplorePage() {
    const [cidades, setCidades] = useState<any[]>([]);

    const [cidadeBusca, setCidadeBusca] = useState(""); // o que usuario tá digitando
    const [mostrarDropdown, setMostrarDropdown] = useState(false);

    useEffect(() => {
        listarCidades()
        .then((dados) => {
            setCidades(dados || []);
        })
        .catch((erro) => {
            console.error("Erro ao carregar o filtro de cidades:", erro);
        });
    }, []);

    const cidadesFiltradas = cidades.filter((cidade) =>
        cidade.nome.toLowerCase().includes(cidadeBusca.toLowerCase()) ||
        cidade.estado.toLowerCase().includes(cidadeBusca.toLowerCase())
    );
    
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
            <div className="relative w-full md:w-64">
                <input
                    type="text"
                    placeholder="Todas as cidades"
                    value={cidadeBusca}
                    onChange={(e) => {
                        setCidadeBusca(e.target.value);
                        setMostrarDropdown(true); // abre a lista quando o usuario começa a digitar
                    }}
                    onClick={() => setMostrarDropdown(true)} // abre a lista se o usuario clicar
                    onBlur={() => setTimeout(() => setMostrarDropdown(false), 200)}
                    className="w-full bg-[var(--secondary)] text-[var(--text-on-dark)] rounded-lg py-3 px-4 pr-10 outline-none placeholder:text-white/80 cursor-text"
                />

                <ChevronDown
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 pointer-events-none"
                />

                {mostrarDropdown && (
                    <ul className="absolute z-50 w-full mt-2 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl text-gray-800 scrollbar-hide">
                        
                        <li
                            className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm font-semibold text-gray-600 border-b border-gray-100"
                            onClick={() => {
                                setCidadeBusca("");
                                setMostrarDropdown(false);
                            }}
                        >
                            Limpar filtro
                        </li>

                        {cidadesFiltradas.length === 0 ? (
                            <li className="px-4 py-3 text-sm text-gray-500 italic">
                                Nenhuma cidade encontrada.
                            </li>
                        ) : (
                            cidadesFiltradas.map((cidade) => (
                                <li
                                    key={cidade.id}
                                    className="px-4 py-2 hover:bg-[var(--secondary)] hover:text-white cursor-pointer transition-colors"
                                    onClick={() => {
                                        setCidadeBusca(`${cidade.nome} - ${cidade.estado}`);
                                        setMostrarDropdown(false);
                                    }}
                                >
                                    {cidade.nome} - {cidade.estado}
                                </li>
                            ))
                        )}
                    </ul>
                )}
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