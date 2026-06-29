"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2, X } from "lucide-react";
import {
  criarAvaliacao,
  editarAvaliacao,
  excluirAvaliacao,
} from "@/app/estabelecimentos/[id]/actions";
import type {
  ReviewActionState,
  ReviewSummary,
} from "@/app/estabelecimentos/[id]/types";
import EstrelasDeAvaliacao from "./EstrelasDeAvaliacao";
import CardDeAvaliacao from "./CardDeAvaliacao";

type SecaoDeAvaliacoesDoUsuarioProps = {
  estabelecimentoId: number;
  usuarioLogado: boolean;
  initialSummary: ReviewSummary;
};

type Modo = "criacao" | "visualizacao" | "edicao" | "confirmacao";

export default function SecaoDeAvaliacoesDoUsuario({
  estabelecimentoId,
  usuarioLogado,
  initialSummary,
}: SecaoDeAvaliacoesDoUsuarioProps) {
  const [summary, setSummary] = useState(initialSummary);
  const [modo, setModo] = useState<Modo>(
    initialSummary.minhaAvaliacao ? "visualizacao" : "criacao",
  );
  const [nota, setNota] = useState(initialSummary.minhaAvaliacao?.nota ?? 0);
  const [comentario, setComentario] = useState(
    initialSummary.minhaAvaliacao?.comentario ?? "",
  );
  const [feedback, setFeedback] = useState("");
  const [isPending, startTransition] = useTransition();

  const minhaAvaliacao = summary.minhaAvaliacao;

  function aplicarResposta(resposta: ReviewActionState) {
    setFeedback(resposta.message);

    if (!resposta.ok || !resposta.summary) return;

    setSummary(resposta.summary);
    setNota(resposta.summary.minhaAvaliacao?.nota ?? 0);
    setComentario(resposta.summary.minhaAvaliacao?.comentario ?? "");
    setModo(resposta.summary.minhaAvaliacao ? "visualizacao" : "criacao");
  }

  function enviarAvaliacao() {
    if (nota < 1 || nota > 5) {
      setFeedback("Selecione uma nota entre 1 e 5 estrelas.");
      return;
    }

    startTransition(async () => {
      const acao = minhaAvaliacao ? editarAvaliacao : criarAvaliacao;
      const resposta = await acao({ estabelecimentoId, nota, comentario });
      aplicarResposta(resposta);
    });
  }

  function cancelarEdicao() {
    setNota(minhaAvaliacao?.nota ?? 0);
    setComentario(minhaAvaliacao?.comentario ?? "");
    setFeedback("");
    setModo("visualizacao");
  }

  function confirmarExclusao() {
    startTransition(async () => {
      const resposta = await excluirAvaliacao(estabelecimentoId);
      aplicarResposta(resposta);
    });
  }

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#24504F]">Sua avaliação</h2>

        {!usuarioLogado ? (
          <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            Para compartilhar sua experiência, faça login na sua conta.
            <Link
              href="/login"
              className="ml-1 font-bold text-[#24504F] hover:underline"
            >
              Entrar agora
            </Link>
          </div>
        ) : modo === "visualizacao" && minhaAvaliacao ? (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <EstrelasDeAvaliacao value={minhaAvaliacao.nota} readOnly size={18} />
              {!minhaAvaliacao.aprovada && (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                  Aguardando aprovação
                </span>
              )}
            </div>

            <p className="text-sm leading-relaxed text-slate-700">
              {minhaAvaliacao.comentario || "Avaliação sem comentário."}
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setModo("edicao")}
                className="inline-flex items-center gap-2 rounded-lg bg-[#24504F] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#1e3a3a]"
              >
                <Pencil size={16} />
                Editar
              </button>
              <button
                type="button"
                onClick={() => setModo("confirmacao")}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50"
              >
                <Trash2 size={16} />
                Excluir
              </button>
            </div>
          </div>
        ) : modo === "confirmacao" ? (
          <div className="mt-4 rounded-lg border border-red-100 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">
              Deseja realmente excluir sua avaliação?
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setModo("visualizacao")}
                disabled={isPending}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-white disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarExclusao}
                disabled={isPending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {isPending ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <EstrelasDeAvaliacao value={nota} onChange={setNota} size={18} />

            <div>
              <label
                htmlFor="comentario"
                className="mb-1 block text-sm font-bold text-slate-700"
              >
                Comentário opcional
              </label>
              <textarea
                id="comentario"
                value={comentario}
                onChange={(event) => setComentario(event.target.value)}
                rows={4}
                className="w-full resize-none rounded-lg border border-slate-300 p-3 text-sm outline-none transition focus:border-[#2E948A] focus:ring-2 focus:ring-[#2E948A]/20"
                placeholder="Conte como foi sua experiência."
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={enviarAvaliacao}
                disabled={isPending}
                className="rounded-lg bg-[#24504F] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#1e3a3a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending
                  ? "Salvando..."
                  : modo === "edicao"
                    ? "Salvar alterações"
                    : "Enviar avaliação"}
              </button>

              {modo === "edicao" && (
                <button
                  type="button"
                  onClick={cancelarEdicao}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                >
                  <X size={16} />
                  Cancelar
                </button>
              )}
            </div>
          </div>
        )}

        {feedback && (
          <p
            className={`mt-4 text-sm font-semibold ${
              feedback.includes("Não") ||
              feedback.includes("inválido") ||
              feedback.includes("Selecione")
                ? "text-red-600"
                : "text-[#24504F]"
            }`}
          >
            {feedback}
          </p>
        )}
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#24504F]">Avaliações</h2>
            <p className="text-sm text-slate-600">
              {summary.numAvaliacoes} avaliação
              {summary.numAvaliacoes === 1 ? "" : "es"} aprovada
              {summary.numAvaliacoes === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <EstrelasDeAvaliacao value={Math.round(summary.mediaNota)} readOnly size={18} />
            <span className="text-sm font-bold text-[#24504F]">
              {summary.mediaNota.toFixed(1)}
            </span>
          </div>
        </div>

        {summary.avaliacoes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
            Nenhuma avaliação aprovada ainda.
          </div>
        ) : (
          <div className="space-y-4">
            {summary.avaliacoes.map((avaliacao) => (
              <CardDeAvaliacao
                key={`${avaliacao.usuarioEmail}-${avaliacao.dataAvaliacao}`}
                nome={avaliacao.usuarioNome}
                nota={avaliacao.nota}
                comentario={avaliacao.comentario}
                data={avaliacao.dataAvaliacao}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
