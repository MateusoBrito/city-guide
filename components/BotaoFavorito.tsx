"use client";

import { Heart } from "lucide-react";
import { alternarFavorito } from "@/app/perfil/favoritos/actions";
import { useState, useEffect } from "react";

export default function BotaoFavorito({ 
  id, 
  ehFavorito: ehFavoritoInicial, 
  email 
}: { 
  id: number, 
  ehFavorito: boolean, 
  email: string | undefined 
}) {
  const [ehFavorito, setEhFavorito] = useState(ehFavoritoInicial);

  useEffect(() => {
    setEhFavorito(ehFavoritoInicial);
  }, [ehFavoritoInicial]);

  const handleClick = async () => {
    if (!email) return alert("Você precisa estar logado!");
    
    setEhFavorito(!ehFavorito);
    
    try {
      await alternarFavorito(email, id);
    } catch (error) {
      setEhFavorito(ehFavoritoInicial);
      alert("Erro ao favoritar.");
    }
  };

  return (
    <Heart
      size={30}
      onClick={handleClick}
      className={`cursor-pointer hover:scale-110 transition-transform ${
        ehFavorito ? "fill-red-500 text-red-500" : "text-[var(--secondary)]"
      }`}
    />
  );
}