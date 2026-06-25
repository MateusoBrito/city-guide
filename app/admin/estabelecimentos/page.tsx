"use client";

import { useState, useEffect } from "react";
import { Building2, CheckSquare } from "lucide-react";
import { 
  listarEstabelecimentosPendentes,
  listarEstabelecimentosAprovados, 
  aprovarEstabelecimento, 
  recusarEstabelecimento 
} from "./actions";
import CardEstabelecimento from "@/components/CardEstabelecimento";

export default function EstabelecimentosAdminPage() {
  const [pendentes, setPendentes] = useState<any[]>([]);
  const [aprovados, setAprovados] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [estabelecimentoSelecionado, setEstabelecimentoSelecionado] = useState<any | null>(null);

  // Carrega ambas as listas em paralelo de forma eficiente
  const carregarDados = async () => {
    try {
      setCarregando(true);
      const [dadosPendentes, dadosAprovados] = await Promise.all([
        listarEstabelecimentosPendentes(),
        listarEstabelecimentosAprovados()
      ]);
      setPendentes(dadosPendentes || []);
      setAprovados(dadosAprovados || []);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleAprovar = async (id: number) => {
    try {
      await aprovarEstabelecimento(id);
      // Pega o item que foi aprovado para mover de lista localmente sem re-fetch
      const itemAprovado = pendentes.find(e => e.id === id);
      setPendentes(prev => prev.filter(e => e.id !== id));
      if (itemAprovado) {
        setAprovados(prev => [...prev, { ...itemAprovado, aprovado: true }].sort((a,b) => a.nome.localeCompare(b.nome)));
      }
      setEstabelecimentoSelecionado(null);
      alert("Estabelecimento aprovado com sucesso!");
    } catch (error) {
      alert("Erro ao aprovar o estabelecimento.");
    }
  };

  const handleDeletarExcluir = async (id: number, eraAprovado: boolean) => {
    const mensagem = eraAprovado 
      ? "Tem certeza que deseja REMOVER este estabelecimento do guia público definitivamente?" 
      : "Tem certeza que deseja recusar e excluir este estabelecimento?";

    if (confirm(mensagem)) {
      try {
        await recusarEstabelecimento(id);
        if (eraAprovado) {
          setAprovados(prev => prev.filter(e => e.id !== id));
        } else {
          setPendentes(prev => prev.filter(e => e.id !== id));
        }
        setEstabelecimentoSelecionado(null);
        alert("Removido com sucesso.");
      } catch (error) {
        alert("Erro ao remover o estabelecimento.");
      }
    }
  };

  return (
    <div className="space-y-12">
      {/* ================= SEÇÃO 1: PENDENTES ================= */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">Moderação de Estabelecimentos</h1>
        </div>

        {carregando ? (
          <div className="text-center p-8 text-slate-500 animate-pulse font-medium">Carregando painel...</div>
        ) : pendentes.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 p-8 text-center rounded-xl text-slate-400 italic text-sm">
            Nenhum estabelecimento aguardando aprovação.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {pendentes.map((est) => (
              <div key={est.id} className="flex flex-col justify-between h-full">
                <CardEstabelecimento
                  nome={est.nome}
                  categoria={`${est.categoria} • ${est.cidade?.nome}`}
                  imagem={est.imagemUrl || "/globe.svg"}
                  avaliacao={est.mediaNota}
                />
                <button 
                  onClick={() => setEstabelecimentoSelecionado(est)}
                  className="mt-3 w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition shadow-sm"
                >
                  Analisar Dados Completos
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="border-slate-200" />

      {/* ================= SEÇÃO 2: JÁ APROVADOS ================= */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"> Estabelecimentos Ativos no Guia</h2>
        </div>

        {!carregando && aprovados.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 p-8 text-center rounded-xl text-slate-400 italic text-sm">
            Nenhum estabelecimento ativo cadastrado no sistema ainda.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {aprovados.map((est) => (
              <div key={est.id} className="flex flex-col justify-between h-full">
                <CardEstabelecimento
                  nome={est.nome}
                  categoria={`${est.categoria} • ${est.cidade?.nome}`}
                  imagem={est.imagemUrl || "/globe.svg"}
                  avaliacao={est.mediaNota}
                />
                <button 
                  onClick={() => setEstabelecimentoSelecionado(est)}
                  className="mt-3 w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition shadow-sm"
                >
                  Ver Ficha / Gerenciar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= MODAL CENTRAL REAPROVEITADO ================= */}
      {estabelecimentoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
            
            <button onClick={() => setEstabelecimentoSelecionado(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold">✕</button>

            <h2 className="text-2xl font-extrabold text-slate-800 border-b pb-3 mb-4">
              {estabelecimentoSelecionado.aprovado ? "Ficha Ativa:" : "Revisar:"} {estabelecimentoSelecionado.nome}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-5">
                <p className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">Imagem do Local</p>
                <div className="w-full h-48 md:h-64 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                  <img src={estabelecimentoSelecionado.imagemUrl || "/globe.svg"} alt={estabelecimentoSelecionado.nome} className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="md:col-span-7 space-y-4 text-slate-700 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Categoria:</strong> 
                    <span className="ml-1 text-xs font-bold text-[#2E948A] uppercase bg-[#2E948A]/10 px-2 py-0.5 rounded">
                      {estabelecimentoSelecionado.categoria}
                    </span>
                  </div>
                  <div><strong>Cidade:</strong> {estabelecimentoSelecionado.cidade?.nome} - {estabelecimentoSelecionado.cidade?.estado}</div>
                </div>

                <div>
                  <strong>Descrição:</strong>
                  <p className="text-slate-600 text-xs bg-slate-50 p-2.5 rounded-lg border mt-1 leading-relaxed italic">
                    "{estabelecimentoSelecionado.descricao || "Nenhuma descrição."}"
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border">
                  <h4 className="font-bold text-xs text-[#2E948A] uppercase tracking-wider mb-2">Endereço</h4>
                  <p><strong>Rua:</strong> {estabelecimentoSelecionado.rua}, Nº {estabelecimentoSelecionado.numero}</p>
                  <p><strong>Bairro:</strong> {estabelecimentoSelecionado.bairro} | <strong>CEP:</strong> {estabelecimentoSelecionado.cep}</p>
                  {estabelecimentoSelecionado.complemento && <p><strong>Complemento:</strong> {estabelecimentoSelecionado.complemento}</p>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm text-slate-700">
              <div className="bg-slate-50 p-3 rounded-lg border">
                <h4 className="font-bold text-xs text-[#2E948A] uppercase tracking-wider mb-2">📞 Contato</h4>
                <p><strong>Telefone:</strong> {estabelecimentoSelecionado.telefone || "Não informado"}</p>
                <p><strong>Site:</strong> {estabelecimentoSelecionado.url || "Não informado"}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border">
                <h4 className="font-bold text-xs text-[#2E948A] uppercase tracking-wider mb-2">Proprietário</h4>
                <p><strong>Nome:</strong> {estabelecimentoSelecionado.proprietario?.nome || "Não identificado"}</p>
                <p><strong>Email:</strong> {estabelecimentoSelecionado.proprietarioEmail || "Não informado"}</p>
              </div>
            </div>

            {/* 🔥 REAPROVEITAMENTO INTELIGENTE DOS BOTÕES CONFORME O STATUS DO COMPONENTE */}
            <div className="flex gap-4 mt-6 border-t pt-4">
              {estabelecimentoSelecionado.aprovado ? (
                /* Layout para quem já está APROVADO */
                <button 
                  onClick={() => handleDeletarExcluir(estabelecimentoSelecionado.id, true)}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition text-sm shadow-md"
                >
                  Excluir Estabelecimento do Sistema
                </button>
              ) : (
                /* Layout original para quem está PENDENTE */
                <>
                  <button 
                    onClick={() => handleDeletarExcluir(estabelecimentoSelecionado.id, false)}
                    className="flex-1 py-3 border border-red-300 hover:bg-red-50 text-red-600 font-bold rounded-xl transition text-sm"
                  >
                    Recusar Cadastro
                  </button>
                  <button 
                    onClick={() => handleAprovar(estabelecimentoSelecionado.id)}
                    className="flex-1 py-3 bg-[#2E948A] hover:bg-[#24756d] text-white font-bold rounded-xl transition text-sm shadow-md"
                  >
                    Aprovar e Publicar
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}