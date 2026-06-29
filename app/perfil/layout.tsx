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
  const isAdmin = usuario?.tipo === "admin";
  const abas = [
    {
      id: 'dados',
      label: 'Meus Dados',
      href: '/perfil/dados',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      ),
    },
    {
      id: 'favoritos',
      label: 'Meus Favoritos',
      href: '/perfil/favoritos',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      ),
    },
    {
      id: 'avaliacoes',
      label: 'Minhas Avaliações',
      href: '/perfil/avaliacoes',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ),
    },
    {
      id: 'estabelecimentos',
      label: 'Meus Estabelecimentos',
      href: '/perfil/estabelecimentos',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-10">
      <div className="max-w-5xl mx-auto px-6">

        {/* CARD BRANCO com avatar, nome e botões */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">

          {/* Lado esquerdo: avatar + info */}
          <div className="flex items-center gap-5">
            {usuario?.image ? (
              <img
                src={usuario.image}
                alt={`Foto de ${usuario.name}`}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-[#2E948A]/30"
              />
            ) : (
              <div className="w-16 h-16 bg-[#2E948A] rounded-full flex items-center justify-center text-white text-2xl font-bold ring-2 ring-[#2E948A]/20">
                {usuario?.name ? usuario.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}

            <div>
              <p>
                Seja Bem Vindo
              </p>
              <h1 className="text-lg font-bold text-slate-800 tracking-wide uppercase">
                {usuario?.name || "Usuário"}
              </h1>
            </div>
          </div>

          {/* Lado direito: botões */}
          <div className="flex gap-3 w-full sm:w-auto">
            {isAdmin && (
              <Link
                href="/admin/cidades"
                className="group flex-1 sm:flex-initial flex items-center justify-center gap-2 border border-[#2E948A]/40 text-[#2E948A] px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-[#2E948A] hover:text-white hover:border-[#2E948A]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Painel Admin
              </Link>
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="group flex-1 sm:flex-initial flex items-center justify-center gap-2 border border-red-300 text-red-500 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-red-500 hover:text-white hover:border-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sair da Conta
            </button>
          </div>
        </div>

        {/* ABAS com ícones */}
        <div className="flex border-b border-slate-200 mt-2">
          {abas.map((aba) => {
            const estaAtiva = pathname.startsWith(aba.href);

            return (
              <Link
                key={aba.id}
                href={aba.href}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-colors duration-150 border-b-2 -mb-px ${
                  estaAtiva
                    ? "border-[#2E948A] text-[#2E948A]"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {aba.icon}
                <span className="hidden sm:inline">{aba.label}</span>
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