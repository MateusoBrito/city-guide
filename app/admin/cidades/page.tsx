// app/admin/cidades/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { criarCidade, listarCidades } from "./actions";

export default function GerenciarCidadesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cidades, setCidades] = useState<any[]>([]);
  const [carregandoCidades, setCarregandoCidades] = useState(true);

  // Efeito 1: Cuida APENAS da segurança (Redirecionamento)
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      // @ts-ignore
      if (session?.user?.tipo !== "admin") {
        router.push("/perfil");
      }
    }
  }, [status, session, router]);

  // Efeito 2: Cuida APENAS de buscar as cidades
  useEffect(() => {
    // Só busca as cidades se a pessoa já estiver logada como admin
    // @ts-ignore
    if (status === "authenticated" && session?.user?.tipo === "admin") {
      listarCidades()
        .then((dados) => {
          setCidades(dados || []);
          setCarregandoCidades(false);
        })
        .catch((erro) => {
          console.error(erro);
          setCarregandoCidades(false);
        });
    }
  }, [status, session]);

  // Tela de bloqueio super rápida apenas enquanto o Google decide quem é você
  if (status === "loading") {
    return <div className="p-10 text-center text-xl font-bold text-[#004d4d]">Carregando painel...</div>;
  }

  // Se chegou aqui e não é admin, não mostra a tela (o router já vai empurrar pra fora)
  // @ts-ignore
  if (session?.user?.tipo !== "admin") return null; 

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#004d4d] mb-8">Painel do Administrador: Gerenciar Cidades</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Formulário de Cadastro SEMPRE APARECE */}
          <div className="bg-white p-6 rounded-xl shadow-sm h-fit border-t-4 border-[#2E948A]">
            <h2 className="text-xl font-bold text-[#24504F] mb-4">Nova Cidade</h2>
            
            <form action={async (formData) => {
              try {
                setCarregandoCidades(true); // Gira a rodinha da tabela
                await criarCidade(formData);
                const dadosAtualizados = await listarCidades();
                setCidades(dadosAtualizados);
                // @ts-ignore
                document.getElementById("cidade-form")?.reset();
              } catch (error) {
                alert("Erro ao cadastrar a cidade. Verifique os dados.");
              } finally {
                setCarregandoCidades(false); // Para a rodinha
              }
            }} id="cidade-form" className="flex flex-col gap-4">
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nome da Cidade</label>
                <input type="text" name="nome" required placeholder="Ex: Ouro Preto" className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2E948A] outline-none text-gray-800" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Estado</label>
                <input type="text" name="estado" required placeholder="Ex: MG" maxLength={2} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2E948A] outline-none text-gray-800 uppercase" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">País</label>
                <input type="text" name="pais" required defaultValue="Brasil" className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2E948A] outline-none text-gray-800" />
              </div>

              <button type="submit" className="bg-[#2E948A] hover:bg-[#24756d] text-white font-bold p-3 rounded-md transition-colors mt-2 shadow-sm">
                Cadastrar Cidade
              </button>
            </form>
          </div>

          {/* Listagem das Cidades */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border-t-4 border-[#24504F]">
            <h2 className="text-xl font-bold text-[#24504F] mb-4">Cidades Ativas no Sistema</h2>
            
            {carregandoCidades ? (
              <div className="text-center p-10 text-gray-500 animate-pulse">
                Buscando cidades no banco de dados...
              </div>
            ) : cidades.length === 0 ? (
              <div className="bg-gray-50 p-6 rounded-md text-center border border-dashed border-gray-300">
                <p className="text-gray-500 italic">Nenhuma cidade cadastrada ainda.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full border-collapse text-left text-gray-700">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-100 text-gray-600 font-bold text-sm">
                      <th className="p-4">ID</th>
                      <th className="p-4">Cidade</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4">País</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {cidades.map((cidade) => (
                      <tr key={cidade.id} className="hover:bg-green-50/50 transition-colors">
                        <td className="p-4 font-bold text-[#2E948A]">#{cidade.id}</td>
                        <td className="p-4 font-semibold text-gray-900">{cidade.nome}</td>
                        <td className="p-4 text-gray-600">{cidade.estado}</td>
                        <td className="p-4 text-gray-600">{cidade.pais}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}