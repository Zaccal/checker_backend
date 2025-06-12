import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { getPrisma } from "./prisma.js";
import { magicLink, openAPI } from "better-auth/plugins";
import { createAuthMiddleware } from "better-auth/api";
import setDefaultLists from "./setDefaultLists.js";

const prisma = getPrisma();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    openAPI(),
    magicLink({
      disableSignUp: true,
      sendMagicLink: async ({ email, token, url }, request) => {},
    }),
  ],
  trustedOrigins: process.env.ORIGINS!.split(" ") || [],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
  },
  hooks: {
    after: createAuthMiddleware(async (c) => {
      if (c.path.startsWith("/sign-up/")) {
        const newSession = c.context.newSession;

        if (newSession) {
          await setDefaultLists(newSession.user.id);
        }
      }
    }),
  },
});

export type AuthType = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
};

export type AuthVariables = {
  user: typeof auth.$Infer.Session.user;
  session: typeof auth.$Infer.Session.session;
};
