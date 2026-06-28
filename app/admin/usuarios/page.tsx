"use client";

import {useState, useEffect} from "react";
import {Shield, User, Trash2, ShieldAlert, ShieldCheck} from "lucide-react";
import {listarUsuarios, atualizarTipoUsuario, deletarUsuario} from "./actions";

export default function UsuariosAdminPage() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setCarregando(true);
      const dados = await listarUsuarios();
      setUsuarios(dados || []);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setCarregando(false);
    }
  };

  const handleAlternarPermissao = async (email: string, tipoAtual: string) => {
    const novoTipo = tipoAtual === "admin" ? "usuario" : "admin"; 
    const acao = novoTipo === "admin" ? "promover a Administrador" : "rebaixar para Usuário Comum";
    
    if (confirm(`Tem certeza que deseja ${acao} este usuário?`)) {
      try {
        await atualizarTipoUsuario(email, novoTipo as any);
        setUsuarios(usuarios.map(u => u.email === email ? { ...u, tipo: novoTipo } : u));
        alert("Permissão atualizada com sucesso!");
      } catch (error) {
        alert("Erro ao alterar permissão.");
      }
    }
  };

  const handleDeletar = async (email: string, nome: string) => {
    if (confirm(`Tem certeza que deseja excluir DEFINITIVAMENTE a conta de ${nome}?`)) {
      try {
        await deletarUsuario(email); 
        setUsuarios(usuarios.filter(u => u.email !== email)); 
        alert("Usuário removido com sucesso.");
      } catch (error) {
        alert("Erro ao remover usuário. Ele pode ter estabelecimentos cadastrados.");
      }
    }
  };

  const usuariosFiltrados = usuarios.filter((user) => {
    const termoBusca = busca.toLowerCase();
    const nomeMatch = user.nome?.toLowerCase().includes(termoBusca) || false;
    const emailMatch = user.email.toLowerCase().includes(termoBusca);
    const passouNaBusca = nomeMatch || emailMatch;

    const passouNoFiltro = filtroTipo === "todos" || user.tipo === filtroTipo;

    return passouNaBusca && passouNoFiltro;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Gerenciar Usuários</h1>
        {/* Barra de Pesquisa e Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        
        {/* Input de Busca Livre */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E948A] outline-none text-sm text-slate-700"
          />
        </div>

        {/* Select de Filtro por Tipo */}
        <div className="sm:w-64">
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E948A] outline-none text-sm text-slate-700 bg-white"
          >
            <option value="todos">Todos os Acessos</option>
            <option value="admin">Apenas Administradores</option>
            <option value="usuario">Apenas Usuários Comuns</option>
          </select>
        </div>
        
      </div>
        <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-full border shadow-sm flex items-center gap-2">
          <User size={16} className="text-[#2E948A]"/> Total: {usuarios.length}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        {carregando ? (
          <p className="text-slate-500 animate-pulse font-medium text-center py-8">Buscando usuários...</p>
        ) : usuarios.length === 0 ? (
          <p className="text-slate-500 text-center py-8 italic">Nenhum usuário encontrado no sistema.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead>
                <tr className="bg-slate-100 font-bold border-b">
                  <th className="p-4 rounded-tl-lg">Usuário</th>
                  <th className="p-4">E-mail</th>
                  <th className="p-4">Nível de Acesso</th>
                  <th className="p-4 text-right rounded-tr-lg">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usuariosFiltrados.map((user) => (
                  <tr key={user.email} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-semibold text-slate-800 flex items-center gap-3">
                      {/* Avatar Simples */}
                      <div className="w-8 h-8 rounded-full bg-[#2E948A]/10 text-[#2E948A] flex items-center justify-center font-bold">
                        {user.nome ? user.nome.charAt(0).toUpperCase() : "U"}
                      </div>
                      {user.nome || "Usuário Sem Nome"}
                    </td>
                    
                    <td className="p-4 text-slate-500">
                      {user.email}
                    </td>
                    
                    <td className="p-4">
                      {user.tipo === "admin" ? (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
                          <ShieldCheck size={14} /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">
                          <User size={14} /> Comum
                        </span>
                      )}
                    </td>
                    
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {/* Botão de Promover/Rebaixar */}
                        <button
                          onClick={() => handleAlternarPermissao(user.email, user.tipo)}
                          title={user.tipo === "admin" ? "Remover privilégios" : "Promover a Admin"}
                          className={`p-2 rounded-lg transition-colors ${
                            user.tipo === "admin" 
                              ? "bg-amber-100 text-amber-700 hover:bg-amber-200" 
                              : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          }`}
                        >
                          {user.tipo === "admin" ? <ShieldAlert size={18} /> : <Shield size={18} />}
                        </button>

                        {/* Botão de Deletar */}
                        <button
                          onClick={() => handleDeletar(user.email, user.nome)}
                          title="Excluir Usuário"
                          className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
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