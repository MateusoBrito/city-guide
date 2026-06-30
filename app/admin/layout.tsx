"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { MapPin, Building2, MessageSquare, Users, ShieldAlert } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated" && session?.user?.tipo !== "admin") {
      router.push("/perfil");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div className="p-10 text-center text-xl font-bold text-[#004d4d]">Carregando painel de controle...</div>;
  }

  if (session?.user?.tipo !== "admin") return null;

  const menuItens = [
    { label: "Cidades", href: "/admin/cidades", icon: MapPin },
    { label: "Estabelecimentos", href: "/admin/estabelecimentos", icon: Building2 },
    { label: "Avaliações", href: "/admin/avaliacoes", icon: MessageSquare },
    { label: "Usuários", href: "/admin/usuarios", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* BARRA LATERAL FIXA */}
      <aside className="w-64 bg-[#24504F] text-white flex flex-col shrink-0 min-h-screen shadow-md">
        <div className="p-6 border-b border-[#2E948A]/30">
          <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2 text-white">
            <ShieldAlert size={40} className="text-[#2E948A]" /> Painel do Administrador
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {menuItens.map((item) => {
            const Icone = item.icon;
            // Verifica se a rota atual começa com o href do item para deixar ativo
            const estaAtivo = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg font-semibold text-sm transition-all ${
                  estaAtivo
                    ? "bg-[#2E948A] text-white shadow-md"
                    : "text-teal-100 hover:bg-[#2E948A]/20 hover:text-white"
                }`}
              >
                <Icone size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* CONTEÚDO DA PÁGINA FILHA */}
      <main className="flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}