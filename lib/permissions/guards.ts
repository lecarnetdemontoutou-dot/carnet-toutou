import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";

/**
 * Récupère la session courante côté serveur (Server Component / Server Action).
 * Ne lève pas d'erreur si l'utilisateur n'est pas connecté.
 */
export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/**
 * Exige un utilisateur connecté. Redirige vers /login sinon.
 * À appeler en haut de chaque Server Action / page privée du dashboard.
 */
export async function requireUser() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }
  return session.user;
}

/**
 * Exige un utilisateur connecté avec le rôle ADMIN. Redirige sinon.
 * Sécurité réelle : toujours revérifiée ici, jamais seulement dans le middleware.
 */
export async function requireAdmin() {
  const user = await requireUser();
  if ((user as { role?: string }).role !== "ADMIN") {
    redirect("/dashboard");
  }
  return user;
}

/**
 * Vérifie que l'utilisateur connecté est bien propriétaire du chien donné.
 * Lève une erreur explicite sinon (à attraper côté UI).
 */
export function assertOwnsPet(userId: string, petOwnerId: string) {
  if (userId !== petOwnerId) {
    throw new Error("FORBIDDEN_NOT_OWNER");
  }
}

export function assertOwnsTag(userId: string, tagOwnerId: string | null) {
  if (tagOwnerId !== userId) {
    throw new Error("FORBIDDEN_NOT_OWNER");
  }
}
