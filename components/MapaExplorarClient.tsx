"use client";

import dynamic from "next/dynamic";

// A importação dinâmica com ssr: false fica salva aqui dentro, onde é permitido!
const MapaTurismoInstancia = dynamic(() => import("@/components/MapaTurismo"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[450px] bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-sm text-slate-400">
      Carregando mapa interativo...
    </div>
  ),
});

// Tipagem idêntica à que o seu MapaTurismo original já recebe
interface LocalMapa {
  id: number;
  nome: string;
  categoria: string;
  latitude: number | null;
  longitude: number | null;
  imagemUrl?: string | null;
}

interface MapaExplorarClientProps {
  latitudeCidade: number;
  longitudeCidade: number;
  estabelecimentos: LocalMapa[];
}

export default function MapaExplorarClient({
  latitudeCidade,
  longitudeCidade,
  estabelecimentos,
}: MapaExplorarClientProps) {
  return (
    <MapaTurismoInstancia
      latitudeCidade={latitudeCidade}
      longitudeCidade={longitudeCidade}
      estabelecimentos={estabelecimentos}
    />
  );
}