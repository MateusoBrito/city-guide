"use client";

import { useSession } from "next-auth/react";
import { AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { data: session } = useSession();

  // @ts-ignore
  const mostrarAviso = session?.user && session.user.perfilIncompleto;

  return (
    <div className="min-h-screen bg-slate-50">
      
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

      <main className="max-w-7xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold text-slate-900">Explore a Cidade</h1>
        <p className="text-slate-500 mt-2">Encontre os melhores projetos e pontos turísticos.</p>
      </main>

    </div>
  );
}