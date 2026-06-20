"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth/auth-client";

export function SignOutButton() {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await signOut();
        router.push("/login");
      }}
      className="rounded-full border border-[var(--color-ring)] px-5 py-2.5 text-sm font-medium text-[var(--color-ink-soft)]"
    >
      Se déconnecter
    </button>
  );
}
