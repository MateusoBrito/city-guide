"use client";

import { useSession } from "next-auth/react";

export default function DadosPage() {
  const { data: session } = useSession();
  const usuario = session?.user;

  return (
    <div className="bg-[#c4caca] p-8 rounded-xl max-w-2xl mx-auto shadow-sm">
      <div className="flex flex-col gap-5">
        <div>
          <label className="block text-[#24504F] font-bold mb-1">Nome completo</label>
          <input 
            type="text" 
            defaultValue={usuario?.name || ""}
            disabled
            className="w-full p-3 rounded-md border-none text-gray-600 bg-white/80 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-[#24504F] font-bold mb-1">E-mail</label>
          <input 
            type="email" 
            defaultValue={usuario?.email || ""}
            disabled
            className="w-full p-3 rounded-md border-none text-gray-600 bg-white/80 cursor-not-allowed"
          />
        </div>
        <p className="text-xs text-[#24504F]/80 italic mt-2 font-medium">
          * Seus dados são gerenciados diretamente pela sua conta do Google.
        </p>
      </div>
    </div>
  );
}