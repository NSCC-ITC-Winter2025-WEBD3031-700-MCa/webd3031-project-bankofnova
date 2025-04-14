import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { CustomSession } from "./lib/types";
import { getUserByEmail, createUser, createDefaultChequingAccount, updateUser } from "./lib/db";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { Account, Profile } from "next-auth";
import { ExtendedUser } from "./lib/types";

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
        }

        if (user && (await bcrypt.compare(credentials.password, user.password))) {
          return {
            id: user.id.toString(),
            email: user.email || "",
            role: user.role,
            name: user.name || "Unknown",
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
        token.email = user.email || "";
        token.role = user.role || "user";
        token.name = user.name || "Unknown";
      }
      return token;
    },

    async session({ session, token }: { session: CustomSession; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string | null;
      }

      const expiration = token.exp && !isNaN(Number(token.exp))
        ? new Date(Number(token.exp) * 1000)
        : new Date();

      session.expires = expiration.toISOString();

      return session;
    },

    async signIn({ user, account, profile }: { user: ExtendedUser; account: Account | null; profile?: Profile }) {
      if (account && (account.provider === "google" || account.provider === "github")) {
        const mutableUser = user as ExtendedUser; // mutable user

        const email = mutableUser.email || profile?.email || "";

        // Check if user exists in DB
        const existingUser = await getUserByEmail(email) as {
          id: number;
          name?: string;
          google_id?: string | null;
          github_id?: string | null;
        } | null;

        let googleId: string | null = null;
        let githubId: string | null = null;

        if (account.provider === "google") {
          const googleProfile = profile as Profile & { sub?: string };
          googleId = googleProfile?.sub || null;
        } else if (account.provider === "github") {
          const githubProfile = profile as Profile & { id?: number | string };
          githubId = githubProfile?.id?.toString() || null;
        }

        const displayName =
        profile?.name ||
        profile?.email?.split('@')[0] || // fallback to first part of email
        "Unknown";

        if (!existingUser) {
          // If no user exists, create new user
          const newUser = {
            email,
            name: displayName, 
            password: "",
            role: "user",
            google_id: googleId || null,
            github_id: githubId || null,
          };

          const newUserId = await createUser(newUser);
          await createDefaultChequingAccount(newUserId);

          mutableUser.id = newUserId.toString();
          mutableUser.google_id = googleId;
          mutableUser.github_id = githubId;
          mutableUser.name = displayName;
          
           } else {
          // Update existing user IDs without overwriting existing data
          const { google_id: existingGoogleId, github_id: existingGithubId } = existingUser;

          const updatedUser = {
            google_id: googleId || existingGoogleId || null,
            github_id: githubId || existingGithubId || null,
          };

          await updateUser(String(existingUser.id), updatedUser);

          mutableUser.id = existingUser.id.toString();
          mutableUser.google_id = updatedUser.google_id;
          mutableUser.github_id = updatedUser.github_id;
          mutableUser.name = existingUser.name || "Unknown"; // ✅ Force correct name from DB
        }
      }

      return true;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);
