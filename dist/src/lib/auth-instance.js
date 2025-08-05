import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { getPrisma } from "./prisma.js";
import { emailOTP, magicLink, openAPI, username } from "better-auth/plugins";
import { createAuthMiddleware } from "better-auth/api";
import setDefaultLists from "./setDefaultLists.js";
import { transport } from "./email.js";
import { setSocialUsername } from "./setSocialUsername.js";
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
            sendVerificationOnSignUp: true,
        }),
    ],
    account: {
        accountLinking: {
            allowDifferentEmails: false,
            enabled: true,
            trustedProviders: ["github", "google"],
        },
    },
    trustedOrigins: process.env.ORIGINS.split(",") || [],
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        autoSignIn: false,
        sendResetPassword: async ({ user, url }) => {
            await transport.sendMail({
                from: process.env.EMAIL,
                to: user.email,
                subject: "Reset your password",
                text: `Click the link to reset your password: ${url}`,
            });
        },
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        },
    },
    hooks: {
        after: createAuthMiddleware(async (c) => {
            const newSession = c.context.newSession;
            if (c.path.startsWith("/magic-link/verify") ||
                c.path.startsWith("/sign-in/email-otp")) {
                if (newSession && !newSession.user.emailVerified) {
                    await setDefaultLists(newSession.user.id);
                }
            }
            else if (c.path.startsWith("/callback/:id")) {
                if (newSession && !newSession.user.username) {
                    await setSocialUsername(newSession.user.id, newSession.user.name);
                    await setDefaultLists(newSession.user.id);
                }
            }
        }),
    },
    advanced: {
        defaultCookieAttributes: {
            httpOnly: true,
            secure: true,
            sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",
            maxAge: 60 * 60 * 24 * 30,
            path: "/",
            domain: process.env.NODE_ENV === "production"
                ? process.env.WEB_DOMAIN
                : undefined,
        },
    },
});
