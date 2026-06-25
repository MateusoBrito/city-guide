"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { criarCidade, listarCidades } from "./actions"; // Verifique o caminho correto das suas actions

export default function CidadesAdminPage() {
  const [cidades, setCidades] = useState<any[]>([]);
  const [carregandoCidades, setCarregandoCidades] = useState(true);

  useEffect(() => {
    listarCidades()
      .then((dados) => setCidades(dados || []))
      .catch(console.error)
      .finally(() => setCarregandoCidades(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Gerenciar Cidades</h1>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Formulário */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Plus size={18} className="text-[#2E948A]" /> Nova Cidade
          </h3>
          <form action={async (formData) => {
            try {
              setCarregandoCidades(true);
              await criarCidade(formData);
              const dadosAtualizados = await listarCidades();
              setCidades(dadosAtualizados);
              // @ts-ignore
              document.getElementById("cidade-form")?.reset();
            } catch (error) {
              alert("Erro ao cadastrar.");
            } finally {
              setCarregandoCidades(false);
            }
          }} id="cidade-form" className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Nome</label>
              <input type="text" name="nome" required className="w-full p-2 border rounded-md text-slate-800" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Estado (UF)</label>
              <input type="text" name="estado" maxLength={2} required className="w-full p-2 border rounded-md text-slate-800" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">País</label>
              <input type="text" name="pais" defaultValue="Brasil" required className="w-full p-2 border rounded-md text-slate-800" />
            </div>
            <button type="submit" className="w-full bg-[#2E948A] text-white p-2.5 rounded-md font-bold hover:bg-[#24756d]">
              Cadastrar
            </button>
          </form>
        </div>

        {/* Tabela */}
        <div className="xl:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Cidades Ativas</h3>
          {carregandoCidades ? <p className="text-slate-500 animate-pulse">Buscando...</p> : (
            <table className="w-full text-left text-sm text-slate-700">
              <thead>
                <tr className="bg-slate-100 font-bold border-b">
                  <th className="p-3">ID</th>
                  <th className="p-3">Nome</th>
                  <th className="p-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {cidades.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-[#2E948A]">#{c.id}</td>
                    <td className="p-3 font-semibold">{c.nome}</td>
                    <td className="p-3">{c.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}