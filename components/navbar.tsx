// components/navbar.tsx
'use client'; // Voltamos a usar Client para não precisar importar nada do route.ts

import Link from 'next/link';
import { signIn, signOut, useSession } from "next-auth/react"; // Funções puras do lado do cliente

export default function Navbar() {
  // Pega a sessão no frontend (precisa que o layout tenha o SessionProvider se for usar o useSession)
  // SE você não quiser usar o useSession para evitar o Provider, você não conseguirá mostrar o "Olá, Mateus" na Navbar.
  const { data: session } = useSession();
  const usuarioLogado = session?.user;

  return (
    <nav className="bg-[#004d4d] text-white shadow-md">
      <div className="mx-auto max-w-full px-4 sm:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* LADO ESQUERDO */}
          <Link href="/" className="flex items-center gap-2 text-white">
            <span className="text-xl font-bold tracking-wide">City Guide</span>
          </Link>

          {/* CENTRO */}
          <div className="flex space-x-10">
            <Link href="/" className="text-base font-medium hover:text-gray-300">Home</Link>
            <Link href="/explorar" className="text-base font-medium hover:text-gray-300">Explorar</Link>
          </div>

          {/* LADO DIREITO */}
          <div className="flex items-center gap-4">
            {!usuarioLogado ? (
                          // Sem formulários ou 'use server'. Apenas um clique de botão comum.
                          <button 
              onClick={() => signIn("google")} 
              className="bg-white/10 px-4 py-1.5 rounded-md"
            >
              Entrar com Google
            </button>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-base font-medium">Olá, {usuarioLogado.name}</span>
                <button 
                  onClick={() => signOut()} 
                  className="text-sm bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                >
                  Sair
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}