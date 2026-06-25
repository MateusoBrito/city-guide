"use client";

import {useSession, signOut} from "next-auth/react"; // puxa os dados do usuário
import {useState} from "react";
import {useRouter} from "next/navigation"; // redireciona o usuário
import Link from "next/link";

export default function paginaPerfil() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [abaAtiva, setAbaAtiva] = useState("dados"); // começa em meus dados

  if (status === "unauthenticated") {
    router.push("/"); //volta pra raiz
    return null;
  }

  if (status === "loading") {
    return <div className="p-8 text-center mt-20">Carregando perfil...</div>;
  }

  const usuario = session?.user;
  const inicial = usuario?.name ? usuario.name.charAt(0).toUpperCase() : "U"; // primeira letra como foto de perfil
  const isAdmin = session?.user?.tipo === "admin";

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-10"> 
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="flex justify-between items-center bg-white p-8 rounded-t-xl shadow-sm">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-[#2E948A] rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {inicial}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1a3a3a]">{usuario?.name}</h1>
              <p className="text-[#2E948A] font-medium mt-1">Membro desde 2026</p>
            </div>
          </div>
          <div className="flex gap-4">
            {isAdmin && (
              <Link 
                href="/admin/cidades"
                className="bg-[#004d4d] hover:bg-[#003333] text-white px-5 py-2.5 rounded-md font-medium transition-colors flex items-center"
              >
                Painel Admin (Cidades)
              </Link>
            )}
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2.5 rounded-md font-medium transition-colors"
            >
              Sair da Conta
            </button>
          </div>
        </div>

        <div className="flex bg-[#24504F] rounded-b-xl overflow-hidden shadow-md">
          {['dados', 'favoritos', 'avaliacoes', 'estabelecimentos'].map((aba) => (
            <button
              key={aba}
              onClick={() => setAbaAtiva(aba)}
              className={`flex-1 py-4 text-center font-semibold transition-colors text-sm sm:text-base ${
                abaAtiva === aba 
                  ? "bg-[#2E948A] text-white" 
                  : "text-gray-300 hover:bg-[#1d403f] hover:text-white"
              } border-r border-[#1d403f] last:border-0`}
            >
              {aba === 'dados' && "Meus Dados"}
              {aba === 'favoritos' && "Meus Favoritos"}
              {aba === 'avaliacoes' && "Minhas Avaliações"}
              {aba === 'estabelecimentos' && "Meus Estabelecimentos"}
            </button>
          ))}
        </div>

        <div className="mt-10">
          {abaAtiva === 'dados' && (
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
                <p className="text-xs text-[#24504F]/80 italic mt-2">
                  * Seus dados são gerenciados diretamente pela sua conta do Google.
                </p>
              </div>
            </div>
          )}

          {abaAtiva !== 'dados' && (
            <div className="text-center text-gray-500 py-10 bg-white rounded-xl shadow-sm">
              Nenhum registro encontrado nesta aba por enquanto.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}