"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { renderToString } from "react-dom/server";
import { Utensils, Coffee, IceCream, Hotel, Beer, ShoppingCart, MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


function obterIconePorCategoria(categoria: string) {
  let iconeString = renderToString(<MapPin className="w-4 h-4 text-white" />);
  let corDeFundo = "bg-blue-400"; 
  const cat = categoria.toLowerCase();

  // 1. Mapeia o Ícone do Lucide e a Cor Suave para cada categoria
  if (cat === "restaurante" || cat === "pizzaria" || cat === "lanchonete") {
    iconeString = renderToString(<Utensils className="w-4 h-4 text-white" />);
    corDeFundo = "bg-red-400";
  } else if (cat === "cafeteria" || cat === "padaria") {
    iconeString = renderToString(<Coffee className="w-4 h-4 text-white" />);
    corDeFundo = "bg-orange-400";
  } else if (cat === "sorveteria") {
    iconeString = renderToString(<IceCream className="w-4 h-4 text-white" />);
    corDeFundo = "bg-pink-400";
  } else if (cat === "hotel" || cat === "pousada") {
    iconeString = renderToString(<Hotel className="w-4 h-4 text-white" />);
    corDeFundo = "bg-purple-400";
  } else if (cat === "bar") {
    iconeString = renderToString(<Beer className="w-4 h-4 text-white" />);
    corDeFundo = "bg-yellow-400";
  } else if (cat === "mercado") {
    iconeString = renderToString(<ShoppingCart className="w-4 h-4 text-white" />);
    corDeFundo = "bg-green-400";
  }

  return L.divIcon({
    html: `
      <div class="relative flex items-center justify-center w-8 h-8">
        <div class="absolute w-8 h-8 ${corDeFundo} rounded-[50%_50%_50%_0%] rotate-[-45deg] border-2 border-white shadow-md z-10 
                    left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        </div>
        
        <div class="absolute z-20 flex items-center justify-center w-full h-full pb-[1px]">
          ${iconeString}
        </div>
      </div>
    `,
    className: "bg-transparent border-none", 
    iconSize: [32, 32],
    iconAnchor: [16, 32], 
    popupAnchor: [0, -32]
  });
}

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
    <div className="w-full h-full min-h-[450px] rounded-xl overflow-hidden border-2 border-slate-200 relative z-10">
      <MapContainer center={centroCidade} zoom={14} className="w-full h-full">
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <MoverCameraMapa centro={centroCidade} />

        {estabelecimentos.map((local) => {
          if (!local.latitude || !local.longitude) return null;

          return (
            <Marker 
              key={local.id} 
              position={[local.latitude, local.longitude]} 
              icon={obterIconePorCategoria(local.categoria)}
            >
              <Popup>
                {/* ... Seu popup atual com foto, nome e categoria permanece intacto ... */}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}