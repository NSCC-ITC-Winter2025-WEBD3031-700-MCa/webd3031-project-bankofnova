// src/types/next-auth.d.ts

import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

// Extend the NextAuth types to include bank_accounts_id
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string | null;
      role: string;
    };
  }

  interface JWT {
    id: string;
    email: string | null;
    role: string;
  }
}
