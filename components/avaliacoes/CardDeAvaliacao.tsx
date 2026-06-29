import RatingStars from "./EstrelasDeAvaliacao";

type CardDeAvaliacaoProps = {
  nome: string;
  nota: number;
  comentario: string | null;
  data: string;
};

export default function CardDeAvaliacao({
  nome,
  nota,
  comentario,
  data,
}: CardDeAvaliacaoProps) {
  const dataFormatada = new Intl.DateTimeFormat("pt-BR").format(new Date(data));

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-bold text-[#24504F]">{nome}</h3>
          <p className="text-xs text-slate-500">{dataFormatada}</p>
        </div>
        <RatingStars value={nota} readOnly size={18} />
      </div>

      {comentario ? (
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          {comentario}
        </p>
      ) : (
        <p className="mt-3 text-sm italic text-slate-400">
          Avaliação sem comentário.
        </p>
      )}
    </article>
  );
}
