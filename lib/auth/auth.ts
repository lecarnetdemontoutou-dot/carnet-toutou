import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db/client";

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
    requireEmailVerification: false, // simplifié pour la V1, à activer plus tard
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
});

export type Session = typeof auth.$Infer.Session;
