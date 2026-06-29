// next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    tipo?: string;
    perfilIncompleto?: boolean;
  }

  interface Session {
    user: {
      tipo?: string;
      perfilIncompleto?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    tipo?: string;
    perfilIncompleto?: boolean;
  }
}
