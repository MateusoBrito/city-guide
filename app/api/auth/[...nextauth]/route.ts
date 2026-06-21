// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/app/lib/prisma";

const handler = NextAuth({
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
});

export { handler as GET, handler as POST };