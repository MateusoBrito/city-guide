import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Globe, MapPin, Phone } from "lucide-react";
import { authOptions } from "@/app/lib/auth";
import { getEstabelecimentoDetalhe, getReviewSummary } from "./data";
import EstrelasDeAvaliacao from "@/components/avaliacoes/EstrelasDeAvaliacao";
import SecaoDeAvaliacoesDoUsuario from "@/components/avaliacoes/SecaoDeAvaliacoesDoUsuario";

type EstabelecimentoPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EstabelecimentoPage({
  params,
}: EstabelecimentoPageProps) {
  const { id } = await params;
  const estabelecimentoId = Number(id);

  if (!Number.isInteger(estabelecimentoId) || estabelecimentoId <= 0) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const usuarioEmail = session?.user?.email ?? null;

  const [estabelecimento, summary] = await Promise.all([
    getEstabelecimentoDetalhe(estabelecimentoId),
    getReviewSummary(estabelecimentoId, usuarioEmail),
  ]);

  if (!estabelecimento) {
    notFound();
  }

  const endereco = [
    `${estabelecimento.rua}, ${estabelecimento.numero}`,
    estabelecimento.complemento,
    estabelecimento.bairro,
    estabelecimento.cep,
    `${estabelecimento.cidade.nome} - ${estabelecimento.cidade.estado}`,
    estabelecimento.cidade.pais,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-8 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
          <section className="space-y-6">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="relative h-72 w-full">
                <Image
                  src={estabelecimento.imagemUrl ?? "/globe.svg"}
                  alt={estabelecimento.nome}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="space-y-5 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-[#2E948A]">
                      {estabelecimento.categoria}
                    </p>
                    <h1 className="mt-1 text-3xl font-extrabold text-[#24504F]">
                      {estabelecimento.nome}
                    </h1>
                  </div>
                  <div className="rounded-xl bg-slate-50 px-4 py-3 text-right">
                    <div className="flex justify-end">
                      <EstrelasDeAvaliacao
                        value={Math.round(summary.mediaNota)}
                        readOnly
                        size={18}
                      />
                    </div>
                    <p className="mt-1 text-sm font-bold text-[#24504F]">
                      {summary.mediaNota.toFixed(1)} de 5
                    </p>
                    <p className="text-xs text-slate-500">
                      {summary.numAvaliacoes} avaliação
                      {summary.numAvaliacoes === 1 ? "" : "es"}
                    </p>
                  </div>
                </div>

                <p className="leading-relaxed text-slate-700">
                  {estabelecimento.descricao}
                </p>

                <div className="grid grid-cols-1 gap-3 text-sm text-slate-700">
                  <div className="flex gap-3 rounded-lg bg-slate-50 p-3">
                    <MapPin
                      className="mt-0.5 shrink-0 text-[#2E948A]"
                      size={18}
                    />
                    <span>{endereco}</span>
                  </div>

                  {estabelecimento.telefone && (
                    <div className="flex gap-3 rounded-lg bg-slate-50 p-3">
                      <Phone
                        className="mt-0.5 shrink-0 text-[#2E948A]"
                        size={18}
                      />
                      <span>{estabelecimento.telefone}</span>
                    </div>
                  )}

                  {estabelecimento.url && (
                    <a
                      href={estabelecimento.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex gap-3 rounded-lg bg-slate-50 p-3 font-semibold text-[#24504F] transition hover:bg-[#2E948A]/10"
                    >
                      <Globe
                        className="mt-0.5 shrink-0 text-[#2E948A]"
                        size={18}
                      />
                      <span>{estabelecimento.url}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>

          <SecaoDeAvaliacoesDoUsuario
            estabelecimentoId={estabelecimento.id}
            usuarioLogado={Boolean(usuarioEmail)}
            initialSummary={summary}
          />
        </div>
      </div>
    </div>
  );
}
