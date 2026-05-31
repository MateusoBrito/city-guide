import React from 'react';
import { BookOpen, Users, Share2, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <GraduationCap className="text-indigo-600 w-8 h-8" />
          <span className="text-2xl font-bold tracking-tight text-indigo-900">Ágora</span>
        </div>
        
        <div className="hidden md:flex gap-8 font-medium">
          <a href="#" className="hover:text-indigo-600 transition">Sobre</a>
          <a href="#" className="hover:text-indigo-600 transition">Comunidades</a>
          <a href="#" className="hover:text-indigo-600 transition">Pesquisa</a>
        </div>

        <div className="flex gap-4">
          <Link 
              href="/login" 
              className="px-4 py-2 text-indigo-600 font-semibold hover:bg-indigo-50 rounded-lg transition flex items-center"
          >
            Login
          </Link>
          <Link 
            href="/registrar" 
            className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-md flex items-center"
          >
            Registrar
          </Link>
        </div>
      </nav>

      <header className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Onde o conhecimento <br /> 
          <span className="text-indigo-600">encontra a colaboração.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Conecte-se com estudantes e pesquisadores, compartilhe materiais e organize seus grupos de estudo na rede social feita para a vida acadêmica.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg">
            Começar agora
          </button>
          <button className="px-8 py-4 bg-white border border-slate-200 text-slate-700 text-lg font-bold rounded-xl hover:bg-slate-300 transition">
            Ver comunidades
          </button>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6 text-indigo-600">
            <Users size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3">Grupos de Estudo</h3>
          <p className="text-slate-600">Encontre colegas da mesma disciplina ou interesse para colaborar em projetos e revisões.</p>
        </div>

        <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6 text-indigo-600">
            <Share2 size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3">Troca de Materiais</h3>
          <p className="text-slate-600">Repositório colaborativo de resumos, exercícios e artigos para potencializar seu aprendizado.</p>
        </div>

        <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6 text-indigo-600">
            <BookOpen size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3">Fóruns de Dúvidas</h3>
          <p className="text-slate-600">Não trave nos estudos. Pergunte à comunidade e ajude outros estudantes a evoluir.</p>
        </div>
      </section>

      <footer className="border-t py-12 mt-12 bg-white text-center text-slate-500 text-sm">
        <p>&copy; 2026 Ágora - Rede Social Acadêmica. Desenvolvido por estudantes para estudantes.</p>
      </footer>
    </div>
  );
}