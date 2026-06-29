"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// 🚀 Carrega o componente do mapa de forma dinâmica apenas no lado do cliente (SSR: False)
const MapaTurismoInstancia = dynamic(() => import("@/components/MapaTurismo"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-slate-100 border-2 border-dashed border-slate-200 animate-pulse rounded-xl flex items-center justify-center text-slate-400 font-medium">
      Carregando mapa turístico interativo...
    </div>
  )
});

export default function PaginaTesteMapa() {
  // Dados simulados de São João del-Rei para testar a centralização
  const [cidadeAtual, setCidadeAtual] = useState({
    nome: "São João del-Rei",
    latitude: -21.1356,
    longitude: -44.2612,
  });

  // Dados simulados de estabelecimentos para testar os Pins interativos
  const [estabelecimentosMock, setEstabelecimentosMock] = useState([
    {
      id: 1,
      nome: "Restaurante Villeiros",
      categoria: "Restaurante",
      latitude: -21.1342,
      longitude: -44.2608,
      imagemUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60"
    },
    {
      id: 2,
      nome: "Café do Largo",
      categoria: "Cafeteria",
      latitude: -21.1365,
      longitude: -44.2625,
      imagemUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&auto=format&fit=crop&q=60"
    },
    {
      id: 3,
      nome: "Pousada Colonial",
      categoria: "Pousada",
      latitude: -21.1380,
      longitude: -44.2595,
      imagemUrl: null // Testando fallback sem foto
    }
  ]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Cabeçalho Simples */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-[#2E948A] uppercase tracking-wider bg-[#2E948A]/10 px-2 py-1 rounded">
            Ambiente de Testes 🧪
          </span>
          <h1 className="text-2xl font-black text-slate-800 mt-2">
            Protótipo do Mapa Interativo
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Visualização geográfica baseada em <strong>{cidadeAtual.nome}</strong>. Clique nos pinos azuis para abrir os popups.
          </p>
        </div>

        {/* Instância do Mapa Cadastrado */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <MapaTurismoInstancia 
            latitudeCidade={cidadeAtual.latitude}
            longitudeCidade={cidadeAtual.longitude}
            estabelecimentos={estabelecimentosMock}
          />
        </div>

        {/* Informações Técnicas de Apoio */}
        <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
          <p>📌 <strong>Cidade Foco:</strong> Lat {cidadeAtual.latitude} | Lng {cidadeAtual.longitude}</p>
          <p>🚀 <strong>Biblioteca:</strong> Leaflet + React-Leaflet (OpenStreetMap Tile Server)</p>
          <p>💡 <strong>Status:</strong> Renderização isolada no Cliente via Next.js Dynamic Imports.</p>
        </div>

      </div>
    </div>
  );
}