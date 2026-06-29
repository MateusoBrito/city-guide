"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
// 1. IMPORTAR AS NOVAS FUNÇÕES DO SEU ACTIONS 🎯
import { criarCidade, listarCidades, deletarCidade, editarCidade } from "./actions"; 
import MapaSeletor from "@/components/MapaSeletor"; 

export default function CidadesAdminPage() {
  const [cidades, setCidades] = useState<any[]>([]);
  const [carregandoCidades, setCarregandoCidades] = useState(true);

  // 🎯 Estados para gerenciar o modo de Edição e Reset do Mapa
  const [cidadeParaEditar, setCidadeParaEditar] = useState<any | null>(null);
  const [chaveResetMapa, setChaveResetMapa] = useState(0);

  // Função isolada para recarregar a lista sempre que houver mutações
  const carregarCidades = () => {
    setCarregandoCidades(true);
    listarCidades()
      .then((dados) => setCidades(dados || []))
      .catch(console.error)
      .finally(() => setCarregandoCidades(false));
  };

  useEffect(() => {
    carregarCidades();
  }, []);

  // 2. FUNÇÃO COM O AVISO DE CONFIRMAÇÃO PARA EXCLUIR ⚠️
  const handleDeletar = async (id: number, nome: string) => {
    const confirmou = confirm(`⚠️ ATENÇÃO:\n\nTem certeza que deseja excluir a cidade de "${nome}"?\nTodos os estabelecimentos vinculados a ela serão deletados permanentemente!`);
    
    if (confirmou) {
      try {
        setCarregandoCidades(true);
        await deletarCidade(id);
        carregarCidades();
        // Se a cidade excluída for a que estava em edição, limpa o formulário
        if (cidadeParaEditar?.id === id) cancelarEdicao();
      } catch (error: any) {
        alert(error.message || "Erro ao deletar cidade.");
        setCarregandoCidades(false);
      }
    }
  };

  // Prepara o formulário com os dados da linha clicada
  const iniciarEdicao = (cidade: any) => {
    setCidadeParaEditar(cidade);
    setChaveResetMapa((prev) => prev + 1);

    setTimeout(() => {
      const form = document.getElementById("cidade-form") as HTMLFormElement;
      if (form) {
        // 🎯 CORRIGIDO: city.nome -> cidade.nome, etc.
        form.nome.value = cidade.nome;
        form.estado.value = cidade.estado;
        form.pais.value = cidade.pais;
      }
    }, 50);
  };

  // Cancela o modo de edição e reseta os campos
  const cancelarEdicao = () => {
    setCidadeParaEditar(null);
    setChaveResetMapa((prev) => prev + 1);
    // @ts-ignore
    document.getElementById("cidade-form")?.reset();
  };

  return (
    <div className="w-full max-w-none px-4 py-4 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Gerenciar Cidades</h1>
      
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Formulário Dinâmico (Cadastro ou Edição) */}
        <div className="xl:col-span-5 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Plus size={18} className="text-[#2E948A]" /> 
              {cidadeParaEditar ? "Editar Cidade" : "Nova Cidade"}
            </span>
            {cidadeParaEditar && (
              <button 
                onClick={cancelarEdicao}
                className="text-xs flex items-center gap-1 text-slate-500 hover:text-slate-800 border px-2 py-1 rounded-md transition"
              >
                <X size={14} /> Cancelar
              </button>
            )}
          </h3>
          
          <form 
            action={async (formData) => {
              try {
                setCarregandoCidades(true);
                
                if (cidadeParaEditar) {
                  await editarCidade(cidadeParaEditar.id, formData);
                } else {
                  await criarCidade(formData);
                }
                
                carregarCidades();
                cancelarEdicao();
              } catch (error: any) {
                alert(error.message || "Erro ao processar a requisição.");
                setCarregandoCidades(false);
              }
            }} 
            id="cidade-form" 
            className="space-y-4"
          >
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Nome</label>
                <input type="text" name="nome" required className="w-full p-2 border rounded-md text-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Estado (UF)</label>
                <input type="text" name="estado" maxLength={2} required className="w-full p-2 border rounded-md text-slate-800" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">País</label>
              <input type="text" name="pais" defaultValue="Brasil" required className="w-full p-2 border rounded-md text-slate-800" />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-600">
                Coordenadas Centrais da Cidade
              </label>
              <p className="text-[11px] text-slate-400 mb-2">
                {cidadeParaEditar 
                  ? "Para alterar a posição, clique em outro ponto no mapa abaixo." 
                  : "Clique no mapa para marcar o ponto central obrigatório da cidade."}
              </p>
              {/* 3. MAPASELETOR CARREGA AS COORDENADAS ANTERIORES SE FOR EDIÇÃO 🎯 */}
              <MapaSeletor 
                key={chaveResetMapa} 
                latPadrao={cidadeParaEditar ? Number(cidadeParaEditar.latitude) : undefined}
                lngPadrao={cidadeParaEditar ? Number(cidadeParaEditar.longitude) : undefined}
              />
            </div>

            <button type="submit" className="w-full bg-[#2E948A] text-white p-2.5 rounded-md font-bold hover:bg-[#24756d] transition-colors">
              {cidadeParaEditar ? "Salvar Alterações" : "Cadastrar"}
            </button>
          </form>
        </div>

        {/* Tabela de Cidades Atualizada com Coluna de Ações */}
        <div className="xl:col-span-7 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Cidades Ativas</h3>
          {carregandoCidades ? <p className="text-slate-500 animate-pulse">Buscando...</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b">
                    <th className="p-3">ID</th>
                    <th className="p-3">Nome</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3">Coordenadas</th>
                    <th className="p-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {cidades.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold text-[#2E948A]">#{c.id}</td>
                      <td className="p-3 font-semibold">{c.nome}</td>
                      <td className="p-3">{c.estado}</td>
                      <td className="p-3 text-xs text-slate-500 font-mono">
                        {`${Number(c.latitude).toFixed(4)}, ${Number(c.longitude).toFixed(4)}`}
                      </td>
                      {/* 4. COLUNA DE BOTÕES DE AÇÕES ADICIONADA 🎯 */}
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => iniciarEdicao(c)}
                            title="Editar Cidade"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDeletar(c.id, c.nome)}
                            title="Excluir Cidade e Vínculos"
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                          >
                            <Trash2 size={16} />
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
    </div>
  );
} 