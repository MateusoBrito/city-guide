import React from 'react';
import { MapPin, Star, Building2, Compass } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Compass className="text-indigo-600 w-8 h-8" />
          <span className="text-2xl font-bold tracking-tight text-indigo-900">
            City Guide
          </span>
        </div>

        <div className="hidden md:flex gap-8 font-medium">
          <a href="#" className="hover:text-indigo-600 transition">
            Cidades
          </a>
          <a href="#" className="hover:text-indigo-600 transition">
            Estabelecimentos
          </a>
          <a href="#" className="hover:text-indigo-600 transition">
            Avaliações
          </a>
        </div>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-indigo-600 font-semibold hover:bg-indigo-50 rounded-lg transition"
          >
            Login
          </Link>

          <Link
            href="/registrar"
            className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-md"
          >
            Registrar
          </Link>
        </div>
      </nav>

      <header className="max-w-7xl mx-auto px-6 py-20 md:py-28 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
          Descubra os melhores lugares da sua cidade
        </h1>

        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto">
          Encontre restaurantes, cafés, bares, hotéis e diversos
          estabelecimentos avaliados pela comunidade.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            href="/estabelecimentos"
            className="px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg"
          >
            Explorar Locais
          </Link>

          <Link
            href="/cidades"
            className="px-8 py-4 bg-white border border-slate-200 text-slate-700 text-lg font-bold rounded-xl hover:bg-slate-100 transition"
          >
            Ver Cidades
          </Link>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6 text-indigo-600">
            <MapPin size={28} />
          </div>

          <h3 className="text-xl font-bold mb-3">
            Descubra Novos Lugares
          </h3>

          <p className="text-slate-600">
            Explore estabelecimentos cadastrados em diferentes cidades e
            encontre opções próximas de você.
          </p>
        </div>

        <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6 text-indigo-600">
            <Star size={28} />
          </div>

          <h3 className="text-xl font-bold mb-3">
            Avaliações da Comunidade
          </h3>

          <p className="text-slate-600">
            Consulte notas e comentários de outros usuários antes de visitar
            um local.
          </p>
        </div>

        <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6 text-indigo-600">
            <Building2 size={28} />
          </div>

          <h3 className="text-xl font-bold mb-3">
            Cadastre Estabelecimentos
          </h3>

          <p className="text-slate-600">
            Administradores podem cadastrar e atualizar informações de
            estabelecimentos e cidades.
          </p>
        </div>
      </section>

      <footer className="border-t py-12 mt-12 bg-white text-center text-slate-500 text-sm">
        <p>
          © 2026 City Guide — Guia colaborativo de cidades e
          estabelecimentos.
        </p>
      </footer>
    </div>
  );
}