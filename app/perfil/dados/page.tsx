"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { listarCidades } from "@/app/admin/cidades/actions";
import { atualizarPerfilUsuario } from "./actions";

export default function DadosPage() {
  const { data: session } = useSession();
  const usuarioSessao = session?.user;

  const [cidades, setCidades] = useState<any[]>([]);
  const [dadosBanco, setDadosBanco] = useState<{ dataNascimento?: string; cidadeId?: number }>({});
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function inicializarDados() {
      try {
        const listaCidades = await listarCidades();
        setCidades(listaCidades || []);
      } catch (erro) {
        console.error("Erro ao carregar dados do perfil:", erro);
      } finally {
        setCarregando(false);
      }
    }

    if (usuarioSessao?.email) {
      inicializarDados();
    }
  }, [usuarioSessao?.email]);

  const formatarDataParaInput = (dataInput: any) => {
    if (!dataInput) return "";
    const d = new Date(dataInput);
    return d.toISOString().split("T")[0];
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="max-w-2xl mx-auto">

        {/* Cabeçalho da seção */}
        <div className="px-8 py-5 border-b border-slate-100 flex items-center gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">Informações pessoais</h2>
            <p className="text-xs text-slate-400">Gerencie os dados do seu perfil</p>
          </div>
        </div>

        {/* Formulário */}
        <form
          action={async (formData) => {
            try {
              await atualizarPerfilUsuario(formData);
              alert("Perfil atualizado com sucesso!");
            } catch (error) {
              alert("Erro ao atualizar o perfil.");
            }
          }}
          className="px-8 py-6 flex flex-col gap-5"
        >
          <input type="hidden" name="email" value={usuarioSessao?.email || ""} />

          {/* Nome */}
          <div className="flex flex-col gap-1.5">
            <label className="text-lg font-semibold text-slate-600 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#2E948A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              Nome completo
            </label>
            <input
              type="text"
              defaultValue={usuarioSessao?.name || ""}
              disabled
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed outline-none text-sm"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xl font-semibold text-slate-600 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#2E948A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              E-mail
            </label>
            <input
              type="email"
              defaultValue={usuarioSessao?.email || ""}
              disabled
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed outline-none text-sm"
            />
          </div>

          {/* Data de Nascimento */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xl font-semibold text-slate-600 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#2E948A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Data de nascimento
            </label>
            <input
              type="date"
              name="dataNascimento"
              defaultValue={formatarDataParaInput(dadosBanco?.dataNascimento)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 outline-none text-sm transition-all focus:border-[#2E948A] focus:ring-2 focus:ring-[#2E948A]/20"
            />
          </div>

          {/* Cidade */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xl font-semibold text-slate-600 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#2E948A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              Cidade / Residência
            </label>
            <select
              name="cidadeId"
              defaultValue={dadosBanco?.cidadeId || ""}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 outline-none text-sm transition-all focus:border-[#2E948A] focus:ring-2 focus:ring-[#2E948A]/20"
            >
              <option value="">Selecione sua cidade...</option>
              {cidades.map((cidade) => (
                <option key={cidade.id} value={cidade.id}>
                  {cidade.nome} - {cidade.estado}
                </option>
              ))}
            </select>
          </div>

          {/* Aviso + botão */}
          <div className="flex flex-col gap-4 pt-2 border-t border-slate-100 mt-1">
            <p className="text-sm text-slate-400 italic flex items-start gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Nome e e-mail são gerenciados pela sua conta do Google. Os demais dados podem ser alterados livremente.
            </p>

            <button
              type="submit"
              className="group w-full flex items-center justify-center gap-2 bg-[#2E948A] hover:bg-[#24504F] text-white font-semibold py-3 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Salvar Alterações
            </button>
          </div>

        </form>
        </div>
      </div>
    </div>
  );
}