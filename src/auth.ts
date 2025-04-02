import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { CustomSession } from "./lib/types"; // Your custom session type
import { getUserByEmail } from "./lib/db";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google"; // Google Provider
import GitHubProvider from "next-auth/providers/github"; // GitHub Provider


export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email", type: "text" },
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
        } 

        console.log("User found:", user); // Check that bank account details are included

        if (user && (await bcrypt.compare(credentials.password, user.password))) {
          return {
            id: user.id.toString(),
            email: user.email || null,
            role: user.role,
            name: user.name || null,  // Ensure name is either string or null
          };
        }

        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    GitHubProvider({
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: Record<string, any> }) {
      if (user) {
        token.id = user.id;
        token.email = user.email || undefined;
        token.role = user.role || undefined;
        token.name = user.name || null;
      }
      return token;
    },
    async session({ session, token }: { session: CustomSession; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string | null; // Ensure name is either string or null
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
