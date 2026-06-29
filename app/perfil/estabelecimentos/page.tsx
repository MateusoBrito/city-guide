"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  criarEstabelecimento, 
  listarMeusEstabelecimentos, 
  deletarMeuEstabelecimento, 
  editarEstabelecimento 
} from "./actions"; 
import { listarCidades } from "@/app/admin/cidades/actions"; 
import { Pencil, Trash2, Clock, CheckCircle } from "lucide-react";
import dynamic from "next/dynamic";

const CATEGORIAS = [
  "Restaurante", "Cafeteria", "Hotel", "Mercado",
  "Bar", "Lanchonete", "Padaria", "Sorveteria", "Pizzaria", "Pousada"
];

export default function EstabelecimentosPage() {
  const { data: session } = useSession();
  const usuario = session?.user;
  
  const [meusLocais, setMeusLocais] = useState<any[]>([]);
  const [cidades, setCidades] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [localParaEditar, setLocalParaEditar] = useState<any | null>(null);

  const MapaSeletor = dynamic(() => import("@/components/MapaSeletor"), {
    ssr: false,
    loading: () => <div className="h-[280px] bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-sm text-gray-400">Carregando mapa seletor...</div>
  });

  // Carrega os dados iniciais
  const carregarDados = async () => {
    if (!usuario?.email) return;
    try {
      setCarregando(true);
      const [dadosLocais, dadosCidades] = await Promise.all([
        listarMeusEstabelecimentos(usuario.email),
        listarCidades()
      ]);
      setMeusLocais(dadosLocais || []);
      setCidades(dadosCidades || []);
    } catch (erro) {
      console.error("Erro ao carregar dados:", erro);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [usuario?.email]);

  const handleExcluir = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir permanentemente este estabelecimento?")) {
      try {
        await deletarMeuEstabelecimento(id, usuario?.email || "");
        setMeusLocais(prev => prev.filter(item => item.id !== id));
        alert("Estabelecimento excluído com sucesso.");
      } catch (error: any) {
        alert(error.message || "Erro ao excluir.");
      }
    }
  };

  const handleIniciarEdicao = (local: any) => {
    setLocalParaEditar(local);
    setMostrarFormulario(true);
  };

  const handleFecharFormulario = () => {
    setMostrarFormulario(false);
    setLocalParaEditar(null);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border-t-4 border-[#2E948A]">
      
      {!mostrarFormulario ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-4 border-b">
            <h2 className="text-2xl font-bold text-[#24504F]">Meus Estabelecimentos</h2>
            <button 
              onClick={() => setMostrarFormulario(true)}
              className="bg-[#2E948A] hover:bg-[#24756d] text-white px-5 py-2.5 rounded-md font-bold transition-colors text-sm shadow-sm"
            >
              + Cadastrar Novo
            </button>
          </div>

          {carregando ? (
            <p className="text-slate-500 animate-pulse text-center py-6">Carregando seus locais...</p>
          ) : meusLocais.length === 0 ? (
            <div className="text-center py-8 text-gray-500 italic">
              Você ainda não possui nenhum estabelecimento cadastrado.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {meusLocais.map((local) => (
                <div key={local.id} className="flex justify-between items-center p-4 border rounded-lg bg-slate-50 hover:bg-slate-100/70 transition-colors">
                  <div className="space-y-1">
                    <h3 className="font-bold text-[#1a3a3a] text-lg">{local.nome}</h3>
                    <p className="text-xs text-gray-500">{local.categoria} • {local.cidade?.nome} - {local.cidade?.estado}</p>
                    
                    <div className="pt-1">
                      {local.aprovado ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle size={12} /> Publicado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          <Clock size={12} /> Em Análise
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleIniciarEdicao(local)}
                      className="p-2 text-slate-600 hover:text-[#2E948A] bg-white border rounded-md shadow-sm hover:bg-slate-50 transition-colors"
                      title="Editar informações"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleExcluir(local.id)}
                      className="p-2 text-red-600 hover:text-red-700 bg-white border rounded-md shadow-sm hover:bg-red-50 transition-colors"
                      title="Excluir do sistema"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* FORMULÁRIO REAPROVEITADO: FUNCIONA TANTO PARA CRIAÇÃO QUANTO PARA EDIÇÃO */
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-[#24504F]">
              {localParaEditar ? `Editar: ${localParaEditar.nome}` : "Novo Estabelecimento"}
            </h2>
            <button 
              onClick={handleFecharFormulario}
              className="text-sm font-semibold text-gray-400 hover:text-red-500 transition-colors"
            >
              ✕ Cancelar e voltar
            </button>
          </div>

          <form 
            action={async (formData) => {
              try {
                if (localParaEditar) {
                  await editarEstabelecimento(localParaEditar.id, formData, usuario?.email || "");
                  alert("Alterações salvas! O local voltou para a fila de aprovação da moderação.");
                } else {
                  await criarEstabelecimento(formData);
                  alert("Sucesso! Seu estabelecimento foi enviado para aprovação da nossa equipe.");
                }
                handleFecharFormulario();
                carregarDados(); 
              } catch (error: any) {
                alert(error.message || "Erro ao processar requisição.");
              }
            }} 
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input type="hidden" name="proprietarioEmail" value={usuario?.email || ""} />
            
            <div className="md:col-span-2 bg-slate-50 p-4 rounded-md border border-dashed border-gray-300">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                {localParaEditar ? "Alterar Foto de Capa (opcional)" : "Foto de Capa do Estabelecimento"}
              </label>
              <input 
                type="file" 
                name="imagem" 
                accept="image/*"
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#2E948A]/10 file:text-[#2E948A] hover:file:bg-[#2E948A]/20 cursor-pointer"
              />
              {localParaEditar?.imagemUrl && (
                <p className="text-xs text-emerald-600 mt-2 font-medium">
                  * Já existe uma foto cadastrada. Se você não selecionar outra, a atual será mantida.
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Nome do Local *</label>
              <input type="text" name="nome" required defaultValue={localParaEditar?.nome || ""} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2E948A] outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Descrição *</label>
              <textarea name="descricao" required rows={3} defaultValue={localParaEditar?.descricao || ""} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2E948A] outline-none resize-none"></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Categoria *</label>
              <select name="categoria" required defaultValue={localParaEditar?.categoria || ""} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2E948A] outline-none bg-white">
                <option value="">Selecione...</option>
                {CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Cidade *</label>
              <select name="cidadeId" required defaultValue={localParaEditar?.cidadeId || ""} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2E948A] outline-none bg-white">
                <option value="">Selecione a cidade...</option>
                {cidades.map((cidade) => (
                  <option key={cidade.id} value={cidade.id}>
                    {cidade.nome} - {cidade.estado}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">CEP *</label>
              <input type="text" name="cep" required defaultValue={localParaEditar?.cep || ""} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2E948A] outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Rua *</label>
              <input type="text" name="rua" required defaultValue={localParaEditar?.rua || ""} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2E948A] outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Bairro *</label>
              <input type="text" name="bairro" required defaultValue={localParaEditar?.bairro || ""} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2E948A] outline-none" />
            </div>

            <div className="flex gap-2">
              <div className="w-1/3">
                <label className="block text-sm font-bold text-gray-700 mb-1">Número *</label>
                <input type="text" name="numero" required defaultValue={localParaEditar?.numero || ""} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2E948A] outline-none" />
              </div>
              <div className="w-2/3">
                <label className="block text-sm font-bold text-gray-700 mb-1">Complemento</label>
                <input type="text" name="complemento" defaultValue={localParaEditar?.complemento || ""} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2E948A] outline-none" />
              </div>
            </div>

            <div className="md:col-span-2 mt-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Localização no Mapa</label>
              <MapaSeletor 
                latPadrao={localParaEditar?.latitude ? parseFloat(localParaEditar.latitude) : undefined}
                lngPadrao={localParaEditar?.longitude ? parseFloat(localParaEditar.longitude) : undefined}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Telefone</label>
              <input type="text" name="telefone" defaultValue={localParaEditar?.telefone || ""} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2E948A] outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Site / Instagram</label>
              <input type="text" name="url" defaultValue={localParaEditar?.url || ""} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2E948A] outline-none" />
            </div>

            <div className="md:col-span-2 mt-4">
              <button type="submit" className="w-full bg-[#24504F] hover:bg-[#1a3a3a] text-white font-bold p-3 rounded-md transition-colors shadow-sm">
                {localParaEditar ? "Salvar e Enviar para Reavaliação" : "Enviar para Aprovação"}
              </button>
            </div>

          </form>
        </div>
      )}
    </div>
  );
}