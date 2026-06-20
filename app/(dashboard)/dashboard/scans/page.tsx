import { requireUser } from "@/lib/permissions/guards";
import { prisma } from "@/lib/db/client";

const EVENT_LABELS: Record<string, string> = {
  SCAN: "Scan de la médaille",
  CALL_CLICK: "Appel déclenché",
  SMS_CLICK: "SMS déclenché",
  FOUND_CLICK: "Signalement \"j'ai trouvé ce chien\"",
};

export default async function ScansPage() {
  const user = await requireUser();

  const scans = await prisma.scanEvent.findMany({
    where: { tag: { userId: user.id } },
    orderBy: { scannedAt: "desc" },
    take: 50,
    include: { pet: true, tag: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[var(--color-orange)]" style={{ fontFamily: "var(--font-display)" }}>
        Historique des scans
      </h1>

      {scans.length === 0 ? (
        <p className="text-[var(--color-ink-soft)]">
          Aucun scan enregistré pour le moment. Dès qu&apos;une médaille est
          scannée, l&apos;événement apparaît ici.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white/70">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-ring)] text-left text-[var(--color-ink-soft)]">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Chien</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Localisation</th>
              </tr>
            </thead>
            <tbody>
              {scans.map((scan) => (
                <tr key={scan.id} className="border-b border-[var(--color-ring)]/50">
                  <td className="px-4 py-3 text-[var(--color-ink-soft)]">
                    {scan.scannedAt.toLocaleString("fr-FR")}
                  </td>
                  <td className="px-4 py-3">{scan.pet?.name ?? "—"}</td>
                  <td className="px-4 py-3">{EVENT_LABELS[scan.eventType]}</td>
                  <td className="px-4 py-3 text-[var(--color-ink-soft)]">
                    {[scan.city, scan.country].filter(Boolean).join(", ") || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
