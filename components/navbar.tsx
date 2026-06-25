"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { MapPin, ChevronDown, User, Users, LogOut, LogIn } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname(); // pega a rota atual
  const router = useRouter();
  const { data: session, status } = useSession(); 
  const [dropdownAberto, setDropdownAberto] = useState(false);

  const usuarioLogado = status === "authenticated";

  return (
    <nav
      className="h-16" style={{ backgroundColor: "var(--secondary)"}}>
      <div className="max-w-7xl mx-auto h-full px-8 flex items-center justify-between">

        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <MapPin className="w-8 h-8 text-white fill-white/10" />
          <span className="text-2xl font-bold text-white">City Guide</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link 
            href="/" 
            className={`font-semibold transition-colors ${
              pathname === "/" ? "text-white" : "text-white/70 hover:text-white"
            }`}
          >
            Home
          </Link>  
          <Link 
            href="/explorar" 
            className={`font-semibold transition-colors ${
              pathname === "/explorar" ? "text-white" : "text-white/70 hover:text-white"
            }`}
          >
            Explorar
          </Link>
        </div>

        <div className="flex items-center gap-4">
          
          {status !== "authenticated" ? (
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white border border-white/20 rounded-full hover:bg-white/10 transition"
            >
              <LogIn size={16} />Login</Link> ) : (
            <div className="relative z-10" onBlur={() => setTimeout(() => setDropdownAberto(false), 200)}>
              <div 
                onClick={() => setDropdownAberto(!dropdownAberto)}
                className="flex items-center gap-2 cursor-pointer group p-1.5 hover:bg-white/10 rounded-full transition border border-transparent hover:border-white/10"
              >
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:bg-white/30 transition">
                  {session?.user?.image ? (
                    <img src={session.user.image} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <ChevronDown size={14} className={`text-white/70 transition-transform ${dropdownAberto ? 'rotate-180' : ''}`} />
              </div>

              {dropdownAberto && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">
                  <button
                    onClick={() => router.push('/perfil')}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 transition flex items-center gap-3"
                  > <Users size={16} className="text-slate-400" /> Meu Perfil </button>

                  <div className="border-t border-slate-100 my-1"></div>
                  
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-3"
                  >
                    <LogOut size={16} className="text-red-400" /> Sair
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}