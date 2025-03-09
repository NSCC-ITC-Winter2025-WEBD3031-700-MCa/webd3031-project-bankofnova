import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { CustomSession } from "./lib/types"; // Your custom session type
import { getUserByEmail, getUserByAccountNumber } from "./lib/db";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Account Number", type: "text" },
        password: { label: "Password or PIN", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Identifier and password are required");
        }

        let user;
        const isEmail = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(credentials.identifier);

        if (isEmail) {
          user = await getUserByEmail(credentials.identifier);
        } else {
          user = await getUserByAccountNumber(credentials.identifier);
        }

        console.log("User found:", user); // Check that bank account details are included

        if (user && (await bcrypt.compare(credentials.password, user.password))) {
          return {
            id: user.id.toString(),
            email: user.email || null,
            role: user.role,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: Record<string, any> }) {
      if (user) {
        token.id = user.id;
        token.email = user.email || undefined;
        token.role = user.role || undefined;
      }
      return token;
    },
    async session({ session, token }: { session: CustomSession; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      session.expires = token.exp?.toString() || new Date().toISOString();
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);
