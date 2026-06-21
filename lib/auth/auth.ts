import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db/client";
import { sendEmail } from "@/lib/email/brevo";

/**
 * Configuration de l'authentification (Better Auth).
 *
 * Choix : Better Auth plutôt qu'Auth.js, pour une intégration Prisma native
 * et une gestion de rôle (USER / ADMIN) plus simple à brancher sur nos
 * Server Actions et Server Components.
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Réinitialisation de ton mot de passe 🐾",
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:auto">
            <h2 style="color:#E8611A">La médaille de mon toutou 🐶</h2>
            <p>Bonjour ${user.name ?? ""},</p>
            <p>Tu as demandé à réinitialiser ton mot de passe. Clique sur le bouton ci-dessous :</p>
            <a href="${url}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#E8611A;color:white;border-radius:999px;text-decoration:none;font-weight:bold">
              Réinitialiser mon mot de passe
            </a>
            <p style="color:#888;font-size:12px">Ce lien expire dans 1 heure. Si tu n'as pas fait cette demande, ignore cet email.</p>
          </div>
        `,
      });
    },
  },
  user: {
    additionalFields: {
      firstName: { type: "string", required: true },
      lastName: { type: "string", required: true },
      phone: { type: "string", required: false },
      role: { type: "string", required: false, defaultValue: "USER" },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 jours
    updateAge: 60 * 60 * 24, // rafraîchie une fois par jour
  },
  rateLimit: {
    enabled: true,
    window: 60,       // fenêtre de 60 secondes
    max: 10,          // max 10 tentatives par fenêtre par IP
  },
});

export type Session = typeof auth.$Infer.Session;
