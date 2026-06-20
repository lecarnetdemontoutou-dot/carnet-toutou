"use client";

import { useTransition } from "react";
import { recordPublicActionAction } from "@/server/actions/public-scan.actions";

type Props = {
  tagId: string;
  petId: string | null;
  phone: string;
  mode: "call" | "sms";
  children: React.ReactNode;
  className?: string;
};

/**
 * Bouton "Appeler" / "SMS" de la page publique.
 * Enregistre le clic (pour les statistiques du propriétaire) puis déclenche
 * l'action native du téléphone (tel: / sms:). On ne bloque jamais l'action
 * réelle en attendant la fin du tracking.
 */
export function PublicActionButton({
  tagId,
  petId,
  phone,
  mode,
  children,
  className,
}: Props) {
  const [, startTransition] = useTransition();

  function handleClick() {
    startTransition(() => {
      recordPublicActionAction({
        tagId,
        petId,
        eventType: mode === "call" ? "CALL_CLICK" : "SMS_CLICK",
      });
    });
  }

  const href = mode === "call" ? `tel:${phone}` : `sms:${phone}`;

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
