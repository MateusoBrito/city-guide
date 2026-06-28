"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function PerfilLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname(); 

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  if (status === "loading") {
    return <div className="p-8 text-center mt-20 font-bold text-[#24504F]">Carregando perfil...</div>;
  }

  const usuario = session?.user;
  const inicial = usuario?.name ? usuario.name.charAt(0).toUpperCase() : "U";
  const isAdmin = usuario?.tipo === "admin";

  const abas = [
    { id: 'dados', label: 'Meus Dados', href: '/perfil/dados' },
    { id: 'favoritos', label: 'Meus Favoritos', href: '/perfil/favoritos' },
    { id: 'avaliacoes', label: 'Minhas Avaliações', href: '/perfil/avaliacoes' },
    { id: 'estabelecimentos', label: 'Meus Estabelecimentos', href: '/perfil/estabelecimentos' }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-10">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="flex justify-between items-center bg-white p-8 rounded-t-xl shadow-sm border-b border-gray-100">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-[#2E948A] rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-inner">
              {inicial}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1a3a3a]">{usuario?.name || "Usuário"}</h1>
              <p className="text-[#2E948A] font-medium mt-1">Membro desde 2026</p>
            </div>
          </div>
          <div className="flex gap-4">
            {isAdmin && (
              <Link 
                href="/admin/cidades"
                className="bg-[#004d4d] hover:bg-[#003333] text-white px-5 py-2.5 rounded-md font-medium transition-colors flex items-center shadow-sm"
              >
                Painel Admin
              </Link>
            )}
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2.5 rounded-md font-medium transition-colors shadow-sm"
            >
              Sair da Conta
            </button>
          </div>
        </div>

        <div className="flex bg-[#24504F] rounded-b-xl overflow-hidden shadow-md">
          {abas.map((aba) => {
            const estaAtiva = pathname.startsWith(aba.href);
            
            return (
              <Link
                key={aba.id}
                href={aba.href}
                className={`flex-1 py-4 text-center font-semibold transition-colors text-sm sm:text-base border-r border-[#1d403f] last:border-0 ${
                  estaAtiva 
                    ? "bg-[#2E948A] text-white" 
                    : "text-gray-300 hover:bg-[#1d403f] hover:text-white"
                }`}
              >
                {aba.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-10 mb-20 animate-fade-in">
          {children}
        </div>

      </div>
    </div>
  );
}