"use client";

import React, { Suspense } from 'react';
import { MapPin, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-100 shadow-xl">
      
      <div className="flex flex-col items-center mb-8 text-center">
        {/* Ícone adaptado para o verde do tema turístico */}
        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
          <MapPin className="w-6 h-6 text-[#24504F]" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bem-vindo ao City Guide</h1>
        <p className="text-slate-500 text-sm mt-2">Acesse sua conta para explorar os melhores locais</p>
      </div>

      {error === 'AccessDenied' && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
          <AlertCircle className="shrink-0 mt-0.5" size={18} />
          <p className="text-sm font-medium">
            Acesso negado. Ocorreu um problema ao validar sua conta.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <button 
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-slate-700 font-semibold py-3 px-4 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Entrar com o Google
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 font-sans relative">
      
      <div className="absolute top-6 left-6">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-[#24504F] transition font-medium">
          <ArrowLeft size={20} />
          Voltar para Home
        </Link>
      </div>

      <Suspense fallback={<div className="text-slate-500">Carregando...</div>}>
        <LoginContent />
      </Suspense>

    </div>
  );
}