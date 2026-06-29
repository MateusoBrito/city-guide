"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { listarFavoritos, alternarFavorito } from "./actions";
import CardEstabelecimento from "@/components/CardEstabelecimento";

export default function FavoritosPage() {
  const { data: session } = useSession();
  const [favoritos, setFavoritos] = useState<any[]>([]);

  useEffect(() => {
    if (session?.user?.email) {
      listarFavoritos(session.user.email).then(setFavoritos);
    }
  }, [session]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Meus Favoritos</h2>
      
      {favoritos.length === 0 ? (
        <p className="text-gray-500 italic">Você ainda não tem locais favoritos.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {favoritos.map((est) => (
             <CardEstabelecimento key={est.id} {...est} />
          ))}
        </div>
      )}
    </div>
  );
}