// src/next-auth.d.ts
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {

  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      name?: string | null;
      image?: string | null;
    };
    expires: string;
  }

  interface JWT {
    id: string;
    email: string;
    role: string;
    name?: string;
  }
}
