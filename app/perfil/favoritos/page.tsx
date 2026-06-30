"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { listarFavoritos, alternarFavorito } from "./actions";
import CardEstabelecimento from "@/components/CardEstabelecimento";
import BotaoFavorito from "@/components/BotaoFavorito";


export default function FavoritosPage() {
  const { data: session } = useSession();
  const [favoritos, setFavoritos] = useState<any[]>([]);

  useEffect(() => {
    if (session?.user?.email) {
      listarFavoritos(session.user.email).then(setFavoritos);
    }
  }, [session]);

  const handleToggle = async (id: number) => {
    if (confirm("Deseja remover dos favoritos?")) {
      await alternarFavorito(session?.user?.email || "", id);
      setFavoritos((prev) => prev.filter((f) => f.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Meus Favoritos</h2>
      
      {favoritos.length === 0 ? (
        <p className="text-gray-500 italic">Você ainda não tem locais favoritos.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {favoritos.map((est) => (
          <CardEstabelecimento
            key={est.id}
            id={est.id}
            nome={est.nome}
            categoria={est.categoria}
            avaliacao={est.mediaNota}
            imagem={est.imagemUrl ? est.imagemUrl : "/placeholder.jpg"} 
            ehFavorito={true} 
          >
            <BotaoFavorito 
              id={est.id} 
              ehFavorito={true} 
              email={session?.user?.email ?? ""} 
            />
          </CardEstabelecimento>
        ))}
      </div>
      )}
    </div>
  );
}