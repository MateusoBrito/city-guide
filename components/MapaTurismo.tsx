"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// 🐛 Correção do bug de ícones invisíveis devido ao empacotamento do Next.js
const iconeCustomizado = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Componente utilitário para mover o foco do mapa caso o usuário mude a cidade
function MoverCameraMapa({ centro }: { centro: [number, number] }) {
  const mapa = useMap();
  useEffect(() => {
    mapa.setView(centro, mapa.getZoom());
  }, [centro, mapa]);
  return null;
}

interface LocalMapa {
  id: number;
  nome: string;
  categoria: string;
  latitude: number | null;
  longitude: number | null;
  imagemUrl?: string | null;
}

interface MapaTurismoProps {
  latitudeCidade: number;
  longitudeCidade: number;
  estabelecimentos: LocalMapa[];
}

export default function MapaTurismo({ latitudeCidade, longitudeCidade, estabelecimentos }: MapaTurismoProps) {
  const centroCidade: [number, number] = [latitudeCidade, longitudeCidade];

  return (
    <div className="w-full h-[450px] rounded-xl overflow-hidden border-2 border-slate-200 shadow-sm relative z-10">
      <MapContainer 
        center={centroCidade} 
        zoom={14} 
        className="w-full h-full"
      >
        {/* Renderiza o design das ruas e quadras usando OpenStreetMap */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Atualiza a câmera se a coordenada da cidade mudar */}
        <MoverCameraMapa centro={centroCidade} />

        {/* Injeta os pinos interativos */}
        {estabelecimentos.map((local) => {
          if (!local.latitude || !local.longitude) return null;

          return (
            <Marker 
              key={local.id} 
              position={[local.latitude, local.longitude]} 
              icon={iconeCustomizado}
            >
              {/* Balão de informações ao clicar no PIN */}
              <Popup>
                <div className="p-1 min-w-[160px] font-sans text-slate-800">
                  {local.imagemUrl && (
                    <img 
                      src={local.imagemUrl} 
                      alt={local.nome} 
                      className="w-full h-20 object-cover rounded mb-2 border border-slate-200"
                    />
                  )}
                  <h4 className="font-bold text-sm m-0 leading-tight">{local.nome}</h4>
                  <p className="text-xs text-[#2E948A] font-bold uppercase m-0 mt-1">
                    {local.categoria}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}