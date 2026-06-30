"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useTransition } from "react";
import { Trash2, Pencil, X } from "lucide-react";
import { buscarAvaliacoesDoUsuario, atualizarAvaliacao, excluirAvaliacao } from "./actions";
import EstrelasDeAvaliacao from "@/components/avaliacoes/EstrelasDeAvaliacao"; // Ajuste o path se necessário

export default function MinhasAvaliacoesPage() {
  const { data: session } = useSession();
  const emailUsuario = session?.user?.email;

  const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Estados para gerenciar a linha que está em modo de edição
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [notaEdicao, setNotaEdicao] = useState<number>(0);
  const [comentarioEdicao, setComentarioEdicao] = useState<string>("");
  const [excluindoId, setExcluindoId] = useState<number | null>(null);

  async function carregarAvaliacoes() {
    if (!emailUsuario) return;
    try {
      const dados = await buscarAvaliacoesDoUsuario(emailUsuario);
      setAvaliacoes(dados);
    } catch (err) {
      console.error("Erro ao carregar avaliações:", err);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarAvaliacoes();
  }, [emailUsuario]);

  const handleSalvarEdicao = async (estabelecimentoId: number) => {
    if (!emailUsuario) return;
    if (notaEdicao < 1 || notaEdicao > 5) return;

    startTransition(async () => {
      try {
        await atualizarAvaliacao(emailUsuario, estabelecimentoId, notaEdicao, comentarioEdicao);
        setEditandoId(null);
        await carregarAvaliacoes();
      } catch (err) {
        alert("Erro ao atualizar avaliação.");
      }
    });
  };

  const handleConfirmarExclusao = async (estabelecimentoId: number) => {
    if (!emailUsuario) return;

    startTransition(async () => {
      try {
        await excluirAvaliacao(emailUsuario, estabelecimentoId);
        setExcluindoId(null);
        await carregarAvaliacoes();
      } catch (err) {
        alert("Erro ao remover avaliação.");
      }
    });
  };

  if (carregando) {
    return <div className="text-center text-[#24504F] font-medium py-8">Carregando histórico...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#24504F]">Histórico de Avaliações</h2>
        <span className="text-xs font-semibold bg-slate-200 px-2.5 py-1 rounded text-slate-600">
          {avaliacoes.length} {avaliacoes.length === 1 ? "avaliação" : "avaliações"}
        </span>
      </div>

      {avaliacoes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-sm text-slate-500">
          Você ainda não avaliou nenhum estabelecimento turístico.
        </div>
      ) : (
        <div className="space-y-4">
          {avaliacoes.map((item) => {
            const isEditing = editandoId === item.estabelecimentoId;
            const isConfirmingDelete = excluindoId === item.estabelecimentoId;
            const dataFormatada = new Intl.DateTimeFormat("pt-BR").format(new Date(item.dataAvaliacao));

            return (
              <article 
                key={item.estabelecimentoId} 
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all"
              >
                {/* Cabeçalho do Card */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between========= ">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-bold text-[#24504F] text-base">
                        {item.estabelecimento?.nome || "Estabelecimento"}
                      </h3>
                      
                      {/* Indicação visual de status aprovado/rejeitado */}
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        item.aprovada 
                          ? "bg-green-50 text-green-700 border border-green-200" 
                          : "bg-amber-50 text-amber-600 border border-amber-200 animate-pulse"
                      }`}>
                        {item.aprovada ? "● Publicada" : "○ Sob Análise"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{dataFormatada}</p>
                  </div>

                  {/* Controle de Estrelas Reutilizado */}
                  <div className="pt-1">
                    <EstrelasDeAvaliacao 
                      value={isEditing ? notaEdicao : item.nota} 
                      onChange={setNotaEdicao} 
                      readOnly={!isEditing} 
                      size={18} 
                    />
                  </div>
                </div>

                {/* Bloco Central: Texto ou Área de Edição */}
                {isEditing ? (
                  <div className="mt-4 space-y-3">
                    <textarea
                      value={comentarioEdicao}
                      onChange={(e) => setComentarioEdicao(e.target.value)}
                      rows={3}
                      className="w-full resize-none rounded-lg border border-slate-300 p-3 text-sm outline-none transition focus:border-[#2E948A] focus:ring-2 focus:ring-[#2E948A]/20 text-slate-700"
                      placeholder="Modifique seu comentário..."
                    />
                  </div>
                ) : (
                  <div className="mt-3">
                    {item.comentario ? (
                      <p className="text-sm leading-relaxed text-slate-700">"{item.comentario}"</p>
                    ) : (
                      <p className="text-sm italic text-slate-400">Avaliação sem comentário.</p>
                    )}
                  </div>
                )}

                {/* Rodapé Dinâmico com os botões de controle de Modo */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  {isConfirmingDelete ? (
                    <div className="flex items-center gap-3 bg-red-50/60 p-2 rounded-lg border border-red-100 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="text-xs font-semibold text-red-700 px-2">Excluir permanentemente?</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setExcluindoId(null)}
                          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                          Não
                        </button>
                        <button
                          type="button"
                          onClick={() => handleConfirmarExclusao(item.estabelecimentoId)}
                          disabled={isPending}
                          className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-red-700"
                        >
                          {isPending ? "Excluindo..." : "Sim"}
                        </button>
                      </div>
                    </div>
                  ) : isEditing ? (
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => handleSalvarEdicao(item.estabelecimentoId)}
                        disabled={isPending}
                        className="flex-1 sm:flex-none rounded-lg bg-[#24504F] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1e3a3a]"
                      >
                        {isPending ? "Salvando..." : "Salvar alterações"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditandoId(null)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                      >
                        <X size={14} /> Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditandoId(item.estabelecimentoId);
                          setNotaEdicao(item.nota);
                          setComentarioEdicao(item.comentario || "");
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                      >
                        <Pencil size={14} className="text-slate-500" />
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => setExcluindoId(item.estabelecimentoId)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50/60"
                      >
                        <Trash2 size={14} />
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}