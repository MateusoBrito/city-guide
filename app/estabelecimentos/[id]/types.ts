export type Review = {
  usuarioEmail: string;
  usuarioNome: string;
  nota: number;
  comentario: string | null;
  dataAvaliacao: string;
};

export type UserReview = {
  nota: number;
  comentario: string | null;
  aprovada: boolean;
  dataAvaliacao: string;
};

export type ReviewSummary = {
  mediaNota: number;
  numAvaliacoes: number;
  avaliacoes: Review[];
  minhaAvaliacao: UserReview | null;
};

export type ReviewActionState = {
  ok: boolean;
  message: string;
  summary?: ReviewSummary;
};
