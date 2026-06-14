'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav className="relative bg-[#004d4d] text-white shadow-md">
      {/* Mudamos max-w-7xl para max-w-full e aumentamos o px para colar mais nos cantos */}
      <div className="mx-auto max-w-full px-4 sm:px-8">
        {/* h-20 reduzido para h-16 para ficar menor/mais compacto */}
        <div className="relative flex h-16 items-center justify-between">
          
          {/* Botão do Menu Mobile */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-200 hover:bg-white/10 hover:text-white focus:outline-none"
            >
              <span className="sr-only">Abrir menu principal</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              ) : (
                <svg className="block h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>

          {/* ESTRUTURA PRINCIPAL: Dividida em 3 partes perfeitas para centralizar */}
          <div className="flex w-full items-center justify-between sm:grid sm:grid-cols-3">
            
            {/* 1. LADO ESQUERDO: Logo na extrema esquerda */}
            <div className="flex justify-center sm:justify-start w-full sm:w-auto">
              <Link href="/" className="flex shrink-0 items-center gap-2 text-white">
                {/* Ícone reduzido de h-8 para h-6 */}
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                {/* Texto reduzido de text-2xl para text-xl */}
                <span className="text-xl font-bold tracking-wide">City Guide</span>
              </Link>
            </div>

            {/* 2. CENTRO: Links de Navegação perfeitamente centralizados no Desktop */}
            <div className="hidden sm:flex sm:justify-center sm:items-center">
              <div className="flex space-x-10"> {/* Espaçamento elegante entre os links */}
                {/* Texto reduzido de text-lg para text-base */}
                <Link href="/" className="text-base font-medium text-white hover:text-gray-300 transition-colors">
                  Home
                </Link>
                <Link href="/explorar" className="text-base font-medium text-white hover:text-gray-300 transition-colors">
                  Explorar
                </Link>
              </div>
            </div>

            {/* 3. LADO DIREITO: Perfil na extrema direita */}
            <div className="hidden sm:flex sm:justify-end sm:items-center">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2.5 rounded-full text-sm focus:outline-none group"
                >
                  <span className="sr-only">Abrir menu do usuário</span>
                  {/* Texto reduzido de text-lg para text-base */}
                  <span className="text-base font-medium text-white group-hover:text-gray-300 transition-colors">
                    Meu Perfil
                  </span>
                  {/* Avatar ligeiramente menor (h-8) */}
                  <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-[#004d4d]">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                </button>

                {/* Dropdown do Perfil */}
                {isProfileOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Link href="/perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Meu Perfil
                    </Link>
                    <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Painel Admin (Moderação)
                    </Link>
                    <hr className="my-1" />
                    <button 
                      onClick={() => alert('Logout...')} 
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Container exclusivo do Perfil para Mobile (para não sumir na tela pequena) */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:hidden">
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex h-8 w-8 rounded-full bg-white items-center justify-center text-[#004d4d]"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Menu Mobile Expandido */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-[#003d3d]">
          <div className="space-y-1 px-2 pt-2 pb-3">
            <Link href="/" className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-white/10">
              Home
            </Link>
            <Link href="/explorar" className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-white/10">
              Explorar
            </Link>
            <Link href="/perfil" className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-white/10">
              Meu Perfil
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}