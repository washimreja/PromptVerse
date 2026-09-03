import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/db";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { enforceDeviceLimit } from "@/lib/session-manager";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("[AUTH] Credentials authorize failed: Missing email or password");
          throw new Error("Email and password are required");
        }

        console.log(`[AUTH] Attempting login for email: ${credentials.email}`);

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          console.error(`[AUTH] Login failed: User not found with email ${credentials.email}`);
          throw new Error("No account found with this email address");
        }

        if (!user.password) {
          console.error(`[AUTH] Login failed: User ${credentials.email} registered via OAuth (no password set)`);
          throw new Error("This account was created via social login. Please sign in with Google or Facebook.");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          console.error(`[AUTH] Login failed: Incorrect password for user ${credentials.email}`);
          throw new Error("Incorrect password. Please try again.");
        }

        console.log(`[AUTH] Login successful for user: ${user.email} (ID: ${user.id})`);
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  callbacks: {
    async signIn({ user }) {
      if (user?.id) {
        await enforceDeviceLimit(user.id, (user as any).membership || "FREE");
      }
      return true;
    },
    async session({ session, token }) {
      if (token && session.user) {
        const u = session.user as any;
        u.id = token.id as string;
        u.role = token.role as string;
        u.membership = token.membership as string;
        u.plan = token.plan as string | undefined;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.membership = (user as any).membership;
        token.plan = (user as any).plan;
      } else if (token.email) {
        // Query latest role & membership from database on session refresh
        try {
          const dbUser = await db.user.findUnique({
            where: { email: token.email },
            select: { id: true, role: true, membership: true, plan: true }
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
            token.membership = dbUser.membership;
            token.plan = dbUser.plan || undefined;
          }
        } catch (e) {
          // Fallback to existing token
        }
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "default_mock_secret_key_for_development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
