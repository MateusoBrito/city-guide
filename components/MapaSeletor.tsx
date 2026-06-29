"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";

// Mantendo o mesmo padrão de ícone que você já validou no seu projeto
const iconeCustomizado = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Move a câmera caso o usuário altere a cidade nos campos acima
function MoverCameraMapa({ centro }: { centro: [number, number] }) {
  const mapa = useMap();
  useEffect(() => {
    mapa.setView(centro, mapa.getZoom());
  }, [centro, mapa]);
  return null;
}

interface MapaSeletorProps {
  latPadrao?: number;
  lngPadrao?: number;
}

export default function MapaSeletor({ latPadrao, lngPadrao }: MapaSeletorProps) {
  const [posicao, setPosicao] = useState<L.LatLng | null>(
    latPadrao && lngPadrao ? new L.LatLng(latPadrao, lngPadrao) : null
  );

  // Escuta os cliques no mapa para mover ou criar o PIN do estabelecimento
  function AuxiliarDeCliques() {
    useMapEvents({
      click(e) {
        setPosicao(e.latlng);
      },
    });
    return posicao ? <Marker position={posicao} icon={iconeCustomizado} /> : null;
  }

  // Se já tiver uma coordenada (edição), foca nela. Caso contrário, centraliza no Brasil
  const centroInicial: [number, number] = posicao 
    ? [posicao.lat, posicao.lng] 
    : [-15.7801, -47.9292];

  return (
    <div className="space-y-2">
      <div className="w-full h-[280px] rounded-xl overflow-hidden border-2 border-slate-200 shadow-sm relative z-10">
        <MapContainer
          center={centroInicial}
          zoom={posicao ? 16 : 4}
          className="w-full h-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <MoverCameraMapa centro={centroInicial} />
          <AuxiliarDeCliques />
        </MapContainer>
      </div>
      
      <input type="hidden" name="latitude" value={posicao ? posicao.lat : ""} />
      <input type="hidden" name="longitude" value={posicao ? posicao.lng : ""} />
    </div>
  );
}