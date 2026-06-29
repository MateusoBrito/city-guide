import { Heart, Check, X } from "lucide-react";

interface CardEstabelecimentoProps {
  id: number;
  nome?: string;
  categoria?: string;
  avaliacao?: number;
  imagem?: string;
  descricao?: string;
  isAdmin?: boolean;
  ehFavorito?: boolean;
  onAprovar?: () => void;
  onRecusar?: () => void;
  children?: React.ReactNode;
}

export default function CardEstabelecimento({
  id, 
  nome = "Nome do Estabelecimento",
  categoria = "Categoria",
  avaliacao = 4,
  imagem = "/placeholder.jpg",
  descricao,
  isAdmin = false,
  ehFavorito = false, 
  onAprovar,
  onRecusar,
  children,
}: CardEstabelecimentoProps) {
  const estrelasCheias = Math.floor(avaliacao);
  const estrelasVazias = 5 - estrelasCheias;

  return (
  <div className="bg-[#f8fafc] rounded-xl border border-slate-100 px-8 py-6 flex flex-col justify-between space-y-3 shadow-sm transition-all duration-200 hover:border-[#2E948A] hover:ring-2 hover:ring-[#2E948A]/10 hover:shadow-md group">
      <div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-[var(--secondary)] leading-tight">
              {nome}
            </h3>
            <p className="text-sm text-[var(--text-on-light)]">
              {categoria}
            </p>
          </div>

          {/* Só mostra o coração se NÃO for tela de administrador */}
          {!isAdmin && (
            <div className="cursor-pointer">
              {children} 
            </div>
          )}
        </div>

        <img
          src={imagem}
          alt={nome}
          className="w-full h-40 object-cover rounded-lg my-2"
        />

        {/* Se for admin, exibe a descrição do estabelecimento enviado */}
        {isAdmin && descricao && (
          <p className="text-sm text-[var(--text-on-light)] line-clamp-3 leading-relaxed mb-4">
            {descricao}
          </p>
        )}
      </div>

      {/* Seção inferior de botões */}
      <div className="flex justify-between items-center pt-2 border-t border-white/5">
        {!isAdmin ? (
          <>
            <div>
              <p className="text-[var(--secondary)] font-medium text-xs">
                Avaliação Geral
              </p>
              <p className="text-[#2E948A] text-2xl tracking-wide select-none">
                {"★".repeat(estrelasCheias)}
                {"☆".repeat(estrelasVazias)}
              </p>
            </div>
            <button className="bg-[var(--secondary)] text-[var(--text-on-dark)] px-4 py-2 rounded-lg shadow-lg hover:bg-[var(--secondary-hover)] transition-colors text-sm font-semibold">
              Ver Detalhes
            </button>
          </>
        ) : (
          /* Layout de Ações do Administrador */
          <div className="flex gap-3 w-full">
            <button 
              onClick={onRecusar}
              className="flex-1 py-2 px-3 border border-red-400 text-red-400 hover:bg-red-500/10 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <X size={14} /> Recusar
            </button>
            <button 
              onClick={onAprovar}
              className="flex-1 py-2 px-3 bg-[var(--secondary)] text-[var(--text-on-dark)] hover:opacity-90 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md"
            >
              <Check size={14} /> Aprovar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}