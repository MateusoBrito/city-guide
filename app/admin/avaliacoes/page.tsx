"use client";

import { useState, useEffect, useTransition } from "react";
import { Star, Filter, MessageSquare } from "lucide-react";
import { buscarAvaliacoesParaPainel, aprovarAvaliacao, rejeitarOuExcluirAvaliacao } from "./actions";
import EstrelasDeAvaliacao from "@/components/avaliacoes/EstrelasDeAvaliacao";

export default function PainelModerarAvaliacoesPage() {
  const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [carregando, setCarregando] = useState(true);
  const [isPending, startTransition] = useTransition();

  async function carregarDados() {
    try {
      setCarregando(true);
      const dados = await buscarAvaliacoesParaPainel();
      setAvaliacoes(dados || []);
    } catch (err) {
      console.error("Erro ao carregar avaliações do painel:", err);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const handleAprovar = (email: string, estabId: number) => {
    startTransition(async () => {
      try {
        await aprovarAvaliacao(email, estabId);
        await carregarDados();
      } catch (err) {
        alert("Erro ao aprovar avaliação.");
      }
    });
  };

  const handleRecusarOuDeletar = (email: string, estabId: number, jaAprovada: boolean) => {
    const mensagem = jaAprovada 
      ? "Deseja excluir permanentemente esta avaliação já publicada?" 
      : "Deseja rejeitar e apagar esta avaliação pendente?";

    if (confirm(mensagem)) {
      startTransition(async () => {
        try {
          await rejeitarOuExcluirAvaliacao(email, estabId);
          await carregarDados();
        } catch (err) {
          alert("Erro ao remover avaliação.");
        }
      });
    }
  };

    const avaliacoesFiltradas = avaliacoes.filter((item) => {
    const termoBusca = busca.toLowerCase();
    
    const usuarioMatch = item.usuario?.nome?.toLowerCase().includes(termoBusca) || false;
    const emailMatch = item.usuario?.email?.toLowerCase().includes(termoBusca) || false;
    const estabMatch = item.estabelecimento?.nome?.toLowerCase().includes(termoBusca) || false;
    const passouNaBusca = usuarioMatch || emailMatch || estabMatch;

    const statusString = item.aprovada ? "publicada" : "pendente";
    const passouNoFiltro = filtroStatus === "todos" || statusString === filtroStatus;

    return passouNaBusca && passouNoFiltro;
  });

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gerenciar Avaliações</h1>
        </div>

        {/* 🔍 BARRA DE PESQUISA E FILTROS NO MEIO */}
        <div className="flex-1 flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 max-w-3xl">
          {/* Input de Busca Livre */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por usuário, e-mail ou estabelecimento..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E948A] outline-none text-sm text-slate-700"
            />
          </div>

          {/* Select de Filtro por Status */}
          <div className="sm:w-64">
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E948A] outline-none text-sm text-slate-700 bg-white"
            >
              <option value="todos">Todos os Status</option>
              <option value="pendente">Pendentes</option>
              <option value="publicada">Publicadas</option>
            </select>
          </div>
        </div>

        {/* Contador Total à Direita */}
        <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-full border shadow-sm flex items-center gap-2 self-start xl:self-auto">
          <MessageSquare size={16} className="text-[#2E948A]"/> Total: {avaliacoes.length}
        </div>
      </div>

      {/* 📊 TABELA DE MODERAÇÃO */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        {carregando ? (
          <p className="text-slate-500 animate-pulse font-medium text-center py-8">Buscando avaliações...</p>
        ) : avaliacoesFiltradas.length === 0 ? (
          <p className="text-slate-500 text-center py-8 italic">Nenhuma avaliação encontrada com esses filtros.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead>
                <tr className="bg-slate-100 font-bold border-b">
                  <th className="p-4 rounded-tl-lg">Autor</th>
                  <th className="p-4">Local</th>
                  <th className="p-4">Avaliação</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right rounded-tr-lg">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {avaliacoesFiltradas.map((item) => (
                  <tr key={`${item.usuarioEmail}-${item.estabelecimentoId}`} className="hover:bg-slate-50 transition-colors">
                    
                    {/* Autor */}
                    <td className="p-4 font-semibold text-slate-800">
                      <div>
                        <p>{item.usuario?.nome || "Sem Nome"}</p>
                        <p className="text-xs font-normal text-slate-400">{item.usuarioEmail}</p>
                      </div>
                    </td>

                    {/* Local */}
                    <td className="p-4 text-slate-600 font-medium">
                      {item.estabelecimento?.nome}
                    </td>
                    
                    {/* Estrelas + Comentário */}
                    <td className="p-4 max-w-xs md:max-w-md">
                      <div className="space-y-1">
                        <EstrelasDeAvaliacao value={item.nota} readOnly size={14} />
                        <p className="text-xs text-slate-500 italic truncate" title={item.comentario}>
                          {item.comentario ? `"${item.comentario}"` : "Sem comentário escrito."}
                        </p>
                      </div>
                    </td>
                    
                    {/* Status */}
                    <td className="p-4">
                      {item.aprovada ? (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold border border-green-200">
                          ● Publicada
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-200 animate-pulse">
                          ○ Pendente
                        </span>
                      )}
                    </td>
                    
                    {/* Ações Simplificadas com visual clean */}
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {!item.aprovada && (
                          <button
                            onClick={() => handleAprovar(item.usuarioEmail, item.estabelecimentoId)}
                            disabled={isPending}
                            className="bg-green-50/50 hover:bg-green-50 text-green-700 border border-green-200 text-xs font-bold py-1.5 px-3 rounded-lg transition disabled:opacity-50"
                          >
                            Aprovar
                          </button>
                        )}
                        <button
                          onClick={() => handleRecusarOuDeletar(item.usuarioEmail, item.estabelecimentoId, item.aprovada)}
                          disabled={isPending}
                          className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold py-1.5 px-3 rounded-lg transition border border-red-200 disabled:opacity-50"
                        >
                          {item.aprovada ? "Excluir" : "Recusar"}
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}