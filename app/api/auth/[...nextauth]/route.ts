import NextAuth, { NextAuthOptions } from "next-auth"; // Adicionamos o tipo por garantia
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/app/lib/prisma";

// 1. Extraímos as configurações para uma constante exportável 🎯
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
        const dbUsuario = await prisma.usuario.findUnique({ where: { email: token.email } });
        if (dbUsuario) {
          token.tipo = dbUsuario.tipo;
          token.perfilIncompleto = !dbUsuario.cidadeId || !dbUsuario.dataNascimento;
        }
      }
      return token;
    },

    async session({ session, token }: any) {
      if (session.user) {
        session.user.tipo = token.tipo;
        session.user.perfilIncompleto = token.perfilIncompleto;
      }
      return session;
    }
  },
  session: { strategy: "jwt" }
};

// 2. O handler continua igual, apenas consumindo a constante acima
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };