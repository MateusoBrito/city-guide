import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/app/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const usuarioExistente = await prisma.usuario.findUnique({
        where: { email: user.email },
      });

      if (!usuarioExistente) {
        await prisma.usuario.create({
          data: {
            email: user.email,
            nome: user.name ?? "",
          },
        });
      }

      return true;
    },

    async jwt({ token }) {
      if (token.email) {
        // Usamos o 'include' para trazer os dados da tabela Cidade também
        const dbUsuario = await prisma.usuario.findUnique({
          where: { email: token.email },
          include: { cidade: true } 
        });

        if (dbUsuario) {
          token.tipo = dbUsuario.tipo;
          token.perfilIncompleto = !dbUsuario.cidadeId || !dbUsuario.dataNascimento;
          
          // Pega o NOME da cidade a partir da relação
          token.cidade = dbUsuario.cidade?.nome; 

          // Lógica para calcular a idade exata a partir da data de nascimento
          if (dbUsuario.dataNascimento) {
            const nascimento = new Date(dbUsuario.dataNascimento);
            const hoje = new Date();
            let idade = hoje.getFullYear() - nascimento.getFullYear();
            const mes = hoje.getMonth() - nascimento.getMonth();
            
            // Subtrai 1 ano se ainda não fez aniversário este ano
            if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
              idade--;
            }
            token.idade = idade;
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.tipo = token.tipo as string;
        session.user.perfilIncompleto = token.perfilIncompleto as boolean;
        
        // Repassa os novos dados do token para o frontend
        session.user.cidade = token.cidade as string;
        session.user.idade = token.idade as number;
      }

      return session;
    },
  },
  session: { strategy: "jwt" },
};