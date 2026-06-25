"use client";

import {useSession, signOut} from "next-auth/react"; // puxa os dados do usuário
import {useState, useEffect} from "react";
import {useRouter} from "next/navigation"; // redireciona o usuário
import Link from "next/link";
import {criarEstabelecimento} from "./actions";
import {listarCidades} from "@/app/admin/cidades/actions"; 

export default function paginaPerfil() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [abaAtiva, setAbaAtiva] = useState("dados"); // começa em meus dados
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const CATEGORIAS = [
    "Restaurante", "Cafeteria", "Hotel", "Mercado",
    "Bar", "Lanchonete", "Padaria", "Sorveteria", "Pizzaria", "Pousada"
  ];

  const [cidades, setCidades] = useState<any[]>([]);
  useEffect(() => {
    listarCidades()
      .then((dados) => setCidades(dados || []))
      .catch((erro) => console.error("Erro ao carregar cidades:", erro));
  }, []);

  if (status === "unauthenticated") {
    router.push("/"); //volta pra raiz
    return null;
  }

  if (status === "loading") {
    return <div className="p-8 text-center mt-20">Carregando perfil...</div>;
  }

  const usuario = session?.user;
  const inicial = usuario?.name ? usuario.name.charAt(0).toUpperCase() : "U"; // primeira letra como foto de perfil
  const isAdmin = session?.user?.tipo === "admin";

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-10"> 
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="flex justify-between items-center bg-white p-8 rounded-t-xl shadow-sm">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-[#2E948A] rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {inicial}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1a3a3a]">{usuario?.name}</h1>
              <p className="text-[#2E948A] font-medium mt-1">Membro desde 2026</p>
            </div>
          </div>
          <div className="flex gap-4">
            {isAdmin && (
              <Link 
                href="/admin/cidades"
                className="bg-[#004d4d] hover:bg-[#003333] text-white px-5 py-2.5 rounded-md font-medium transition-colors flex items-center"
              >
                Painel Admin (Cidades)
              </Link>
            )}
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2.5 rounded-md font-medium transition-colors"
            >
              Sair da Conta
            </button>
          </div>
        </div>

        <div className="flex bg-[#24504F] rounded-b-xl overflow-hidden shadow-md">
          {['dados', 'favoritos', 'avaliacoes', 'estabelecimentos'].map((aba) => (
            <button
              key={aba}
              onClick={() => setAbaAtiva(aba)}
              className={`flex-1 py-4 text-center font-semibold transition-colors text-sm sm:text-base ${
                abaAtiva === aba 
                  ? "bg-[#2E948A] text-white" 
                  : "text-gray-300 hover:bg-[#1d403f] hover:text-white"
              } border-r border-[#1d403f] last:border-0`}
            >
              {aba === 'dados' && "Meus Dados"}
              {aba === 'favoritos' && "Meus Favoritos"}
              {aba === 'avaliacoes' && "Minhas Avaliações"}
              {aba === 'estabelecimentos' && "Meus Estabelecimentos"}
            </button>
          ))}
        </div>

        <div className="mt-10">
          {abaAtiva === 'dados' && (
            <div className="bg-[#c4caca] p-8 rounded-xl max-w-2xl mx-auto shadow-sm">
              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-[#24504F] font-bold mb-1">Nome completo</label>
                  <input 
                    type="text" 
                    defaultValue={usuario?.name || ""}
                    disabled
                    className="w-full p-3 rounded-md border-none text-gray-600 bg-white/80 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-[#24504F] font-bold mb-1">E-mail</label>
                  <input 
                    type="email" 
                    defaultValue={usuario?.email || ""}
                    disabled
                    className="w-full p-3 rounded-md border-none text-gray-600 bg-white/80 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-[#24504F]/80 italic mt-2">
                  * Seus dados são gerenciados diretamente pela sua conta do Google.
                </p>
              </div>
            </div>
          )}

          {abaAtiva === 'estabelecimentos' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border-t-4 border-[#2E948A]">
              
              {!mostrarFormulario ? (
                <div className="text-center py-6">
                  <h2 className="text-2xl font-bold text-[#24504F] mb-4">Meus Estabelecimentos</h2>
                  <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                    Você ainda não possui nenhum estabelecimento cadastrado. Novos locais precisam ser aprovados pela nossa equipe.
                  </p>
                  <button 
                    onClick={() => setMostrarFormulario(true)}
                    className="bg-[#2E948A] hover:bg-[#24756d] text-white px-8 py-3 rounded-full font-bold transition-colors shadow-md"
                  >
                    + Cadastrar Novo Estabelecimento
                  </button>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-[#24504F]">Novo Estabelecimento</h2>
                    <button 
                      onClick={() => setMostrarFormulario(false)}
                      className="text-sm font-semibold text-gray-400 hover:text-red-500 transition-colors"
                    >
                      ✕ Cancelar e fechar
                    </button>
                  </div>

                  <form action={async (formData) => {
                    try {
                      await criarEstabelecimento(formData);
                      alert("Sucesso! Seu estabelecimento foi enviado para aprovação da nossa equipe.");
                      setMostrarFormulario(false); 
                    } catch (error) {
                      alert("Erro ao cadastrar. Verifique se preencheu tudo corretamente.");
                    }
                  }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <input type="hidden" name="proprietarioEmail" value={usuario?.email || ""} />
    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-1">Nome do Local *</label>
                      <input type="text" name="nome" required className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2E948A] outline-none" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-1">Descrição *</label>
                      <textarea name="descricao" required rows={3} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2E948A] outline-none resize-none"></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Categoria *</label>
                      <select name="categoria" required className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2E948A] outline-none bg-white">
                        <option value="">Selecione...</option>
                        {CATEGORIAS.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Cidade *</label>
                      <select name="cidadeId" required className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2E948A] outline-none bg-white">
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
                      <input type="text" name="cep" required className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2E948A] outline-none" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Rua *</label>
                      <input type="text" name="rua" required className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2E948A] outline-none" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Bairro *</label>
                      <input type="text" name="bairro" required className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2E948A] outline-none" />
                    </div>

                    <div className="flex gap-2">
                      <div className="w-1/3">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Número *</label>
                        <input type="text" name="numero" required className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2E948A] outline-none" />
                      </div>
                      <div className="w-2/3">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Complemento</label>
                        <input type="text" name="complemento" className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2E948A] outline-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Telefone</label>
                      <input type="text" name="telefone" className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2E948A] outline-none" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Site / Instagram</label>
                      <input 
                        type="text" 
                        name="url" 
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2E948A] outline-none" 
                      />
                    </div>

                    <div className="md:col-span-2 mt-4">
                      <button type="submit" className="w-full bg-[#24504F] hover:bg-[#1a3a3a] text-white font-bold p-3 rounded-md transition-colors shadow-sm">
                        Enviar para Aprovação
                      </button>
                    </div>

                  </form>
                </div>
              )}
            </div>
          )}

          {(abaAtiva === 'favoritos' || abaAtiva === 'avaliacoes') && (
            <div className="text-center text-gray-500 py-10 bg-white rounded-xl shadow-sm">
              Nenhum registro encontrado nesta aba por enquanto.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}