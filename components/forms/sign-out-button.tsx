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
      className="rounded-full border border-white/40 px-4 py-1.5 text-sm font-medium text-white/90 hover:bg-white/20 transition"
    >
      Se déconnecter
    </button>
  );
}
