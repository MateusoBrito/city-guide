"use client";

import { useSession } from "next-auth/react";
import { AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { data: session } = useSession();

  // @ts-ignore
  const mostrarAviso = session?.user && session.user.perfilIncompleto;

  return (
    // Ocupa a tela toda menos o espaço da navbar
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-[#24504F]">
      
      {mostrarAviso && (
        <div className="bg-emerald-50 border-b border-emerald-200">
          <div className="max-w-7xl mx-auto px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-slate-700 text-sm font-medium">
              <AlertCircle className="text-[#24504F] shrink-0" size={20} />
              <span>
                Olá, <strong>{session?.user?.name?.split(" ")[0]}</strong>! Seu perfil do City Guide ainda não está completo. Adicione sua cidade para uma melhor experiência.
              </span>
            </div>
            <Link 
              href="/perfil" 
              className="flex items-center gap-1 text-sm font-bold text-[#24504F] hover:underline shrink-0"
            >
              Completar Perfil <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}

      <main 
        className="relative flex-1 flex flex-col justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/imagem_home.webp')" }}
      >
        <div className="absolute inset-0 bg-black/60 z-0"></div> {/* camada escura */}

        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 py-16">
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-md">
            Seja bem vindo(a) ao
          </h1>
          
          <div className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6 drop-shadow-lg">
            <span className="text-[#2E948A]">City</span>
            <span className="text-white">Guide</span>
          </div>
          
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-10 leading-relaxed drop-shadow-md">
            Encontre o local ideal para o que você precisa! Explore as avaliações, cadastre novos estabelecimentos e compartilhe suas próprias experiências com a comunidade.
          </p>

        </div>
      </main>

      <footer className="bg-[#24504F] text-center py-4 text-white/80 text-sm">
        <p>© 2026 CityGuide - Guia de Turismo.</p>
      </footer>

    </div>
  );
}