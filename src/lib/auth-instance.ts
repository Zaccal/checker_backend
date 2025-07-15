import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { getPrisma } from "./prisma.js";
import { emailOTP, magicLink, openAPI, username } from "better-auth/plugins";
import { createAuthMiddleware } from "better-auth/api";
import setDefaultLists from "./setDefaultLists.js";
import { transport } from "./email.js";

const prisma = getPrisma();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    openAPI(),
    username(),
    magicLink({
      disableSignUp: true,
      sendMagicLink: async ({ email, url }) => {
        await transport.sendMail({
          from: process.env.EMAIL,
          to: email,
          subject: "Sign in to your account",
          text: `Click the link to sign in to your account: ${url}`,
        });
      },
    }),
    emailOTP({
      sendVerificationOTP: async ({ email, otp }) => {
        await transport.sendMail({
          from: process.env.EMAIL,
          to: email,
          subject: "Verify code",
          text: `you OTP code: ${otp}`,
        });
      },
      expiresIn: 600,
      allowedAttempts: 3,
    }),
  ],
  trustedOrigins: process.env.ORIGINS!.split(",") || [],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
  },
  hooks: {
    after: createAuthMiddleware(async (c) => {
      if (
        c.path.startsWith("/magic-link/verify") ||
        c.path.startsWith("/sign-in/email-otp")
      ) {
        const newSession = c.context.newSession;

        if (newSession && !newSession.user.emailVerified) {
          await setDefaultLists(newSession.user.id);
        }
      }
    }),
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "None",
    },
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
