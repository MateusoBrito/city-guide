import { Heart } from "lucide-react";

type CardEstabelecimentoProps = {
  nome?: string;
  categoria?: string;
  avaliacao?: number;
  imagem?: string;
};

export default function CardEstabelecimento({
  nome = "Nome do Estabelecimento",
  categoria = "Categoria",
  avaliacao = 4,
  imagem = "/placeholder.jpg",
}: CardEstabelecimentoProps) {
  const estrelasCheias = Math.floor(avaliacao);
  const estrelasVazias = 5 - estrelasCheias;

  return (
    <div className="bg-black/20 rounded-lg px-8 py-6 shadow-xl space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-[var(--secondary)] leading-tight">
            {nome}
          </h3>

          <p className="text-sm text-[var(--text-on-light)]">
            {categoria}
          </p>
        </div>

        <Heart
          size={30}
          className="text-[var(--secondary)] cursor-pointer hover:scale-110 transition-transform"
        />
      </div>

      <img
        src={imagem}
        alt={nome}
        className="w-full h-40 object-cover rounded-lg"
      />

      <div className="flex justify-between items-center">
        <div>
          <p className="text-[var(--secondary)] font-medium">
            Avaliação Geral
          </p>

          <p className="text-yellow-400">
            {"★".repeat(estrelasCheias)}
            {"☆".repeat(estrelasVazias)}
          </p>
        </div>

        <button className="bg-[var(--secondary)] text-[var(--text-on-dark)] px-4 py-2 rounded-lg shadow-lg hover:bg-[var(--secondary-hover)] transition-colors">
          Ver Detalhes
        </button>
      </div>
    </div>
  );
}