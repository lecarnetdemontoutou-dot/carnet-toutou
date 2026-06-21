import Link from "next/link";
import { prisma } from "@/lib/db/client";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const start7Days = new Date(now);
  start7Days.setDate(now.getDate() - 7);
  const start30Days = new Date(now);
  start30Days.setDate(now.getDate() - 30);

  const [
    totalUsers,
    newUsersToday,
    newUsers7d,
    totalPets,
    lostPets,
    totalTags,
    activeTags,
    unassignedTags,
    scansToday,
    scans7d,
    totalFoundReports,
    recentFoundReports,
    recentScans,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.user.count({ where: { createdAt: { gte: start7Days } } }),
    prisma.pet.count(),
    prisma.pet.count({ where: { isLost: true } }),
    prisma.tag.count(),
    prisma.tag.count({ where: { status: "ACTIVE" } }),
    prisma.tag.count({ where: { status: "UNASSIGNED" } }),
    prisma.scanEvent.count({ where: { scannedAt: { gte: startOfToday } } }),
    prisma.scanEvent.count({ where: { scannedAt: { gte: start7Days } } }),
    prisma.foundReport.count(),
    prisma.foundReport.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { pet: { include: { user: true } } },
    }),
    prisma.scanEvent.findMany({
      orderBy: { scannedAt: "desc" },
      take: 8,
      include: { pet: true, tag: true },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const activationRate = totalTags > 0 ? Math.round((activeTags / totalTags) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-ink)]">Vue d'ensemble</h1>
          <p className="text-sm text-[var(--color-ink-soft)]">
            {now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <a
          href="/admin/backup"
          className="rounded-full border border-[var(--color-ring)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-ink-soft)] hover:bg-[var(--color-sand)] transition"
        >
          ↓ Sauvegarder les données
        </a>
      </div>

      {/* Alertes */}
      {(lostPets > 0 || recentFoundReports.length > 0) && (
        <div className="space-y-2">
          {lostPets > 0 && (
            <div className="flex items-center gap-3 rounded-2xl bg-red-50 border border-red-200 px-5 py-3">
              <span className="text-xl">🚨</span>
              <div>
                <p className="font-semibold text-red-700">{lostPets} chien{lostPets > 1 ? "s" : ""} marqué{lostPets > 1 ? "s" : ""} comme perdu{lostPets > 1 ? "s" : ""}</p>
                <Link href="/admin/pets" className="text-sm text-red-600 underline">Voir les chiens →</Link>
              </div>
            </div>
          )}
          {recentFoundReports.length > 0 && (
            <div className="flex items-center gap-3 rounded-2xl bg-amber-50 border border-amber-200 px-5 py-3">
              <span className="text-xl">📬</span>
              <div>
                <p className="font-semibold text-amber-700">{totalFoundReports} signalement{totalFoundReports > 1 ? "s" : ""} "J'ai trouvé ce chien"</p>
                <p className="text-sm text-amber-600">Dernier : {recentFoundReports[0]?.createdAt.toLocaleString("fr-FR")}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats principales */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Utilisateurs"
          value={totalUsers}
          sub={`+${newUsersToday} aujourd'hui · +${newUsers7d} cette semaine`}
          href="/admin/users"
          color="blue"
        />
        <StatCard
          label="Chiens"
          value={totalPets}
          sub={lostPets > 0 ? `🚨 ${lostPets} porté${lostPets > 1 ? "s" : ""} disparu${lostPets > 1 ? "s" : ""}` : "Tous OK"}
          href="/admin/pets"
          color={lostPets > 0 ? "red" : "green"}
        />
        <StatCard
          label="Médailles actives"
          value={activeTags}
          sub={`${activationRate}% d'activation · ${unassignedTags} en stock`}
          href="/admin/tags"
          color="orange"
        />
        <StatCard
          label="Scans"
          value={scansToday}
          sub={`${scans7d} sur 7 jours`}
          href="/admin/scans"
          color="purple"
        />
      </div>

      {/* Signalements "J'ai trouvé ce chien" */}
      {recentFoundReports.length > 0 && (
        <Section title="📬 Derniers signalements « J'ai trouvé ce chien »">
          <div className="divide-y divide-[var(--color-ring)]">
            {recentFoundReports.map((report) => (
              <div key={report.id} className="flex items-start justify-between gap-4 py-3">
                <div>
                  <p className="font-medium text-[var(--color-ink)]">
                    {report.finderName} a trouvé <strong>{report.pet.name}</strong>
                  </p>
                  <p className="text-sm text-[var(--color-ink-soft)]">
                    Propriétaire : {report.pet.user.firstName} {report.pet.user.lastName} — {report.pet.user.email}
                  </p>
                  {report.locationText && (
                    <p className="text-sm text-[var(--color-ink-soft)]">📍 {report.locationText}</p>
                  )}
                  {report.message && (
                    <p className="mt-1 text-sm italic text-[var(--color-ink-soft)]">"{report.message}"</p>
                  )}
                </div>
                <span className="shrink-0 text-xs text-[var(--color-ink-soft)]">
                  {report.createdAt.toLocaleString("fr-FR")}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Activité récente */}
        <Section title="🔔 Derniers scans">
          <div className="divide-y divide-[var(--color-ring)]">
            {recentScans.length === 0 && (
              <p className="py-3 text-sm text-[var(--color-ink-soft)]">Aucun scan pour le moment.</p>
            )}
            {recentScans.map((scan) => (
              <div key={scan.id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <span className="font-medium text-[var(--color-ink)]">{scan.pet?.name ?? "—"}</span>
                  <span className="ml-2 text-[var(--color-ink-soft)]">{EVENT_LABELS[scan.eventType]}</span>
                </div>
                <div className="text-right text-[var(--color-ink-soft)]">
                  <p>{scan.scannedAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</p>
                  <p className="text-xs">{[scan.city, scan.country].filter(Boolean).join(", ") || "—"}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/admin/scans" className="mt-3 block text-center text-sm text-[var(--color-ink-soft)] underline">
            Voir tout l'historique →
          </Link>
        </Section>

        {/* Nouveaux inscrits */}
        <Section title="👋 Derniers inscrits">
          <div className="divide-y divide-[var(--color-ring)]">
            {recentUsers.length === 0 && (
              <p className="py-3 text-sm text-[var(--color-ink-soft)]">Aucun utilisateur.</p>
            )}
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <p className="font-medium text-[var(--color-ink)]">{u.firstName} {u.lastName}</p>
                  <p className="text-[var(--color-ink-soft)]">{u.email}</p>
                </div>
                <span className="text-xs text-[var(--color-ink-soft)]">
                  {u.createdAt.toLocaleDateString("fr-FR")}
                </span>
              </div>
            ))}
          </div>
          <Link href="/admin/users" className="mt-3 block text-center text-sm text-[var(--color-ink-soft)] underline">
            Voir tous les utilisateurs →
          </Link>
        </Section>
      </div>

      {/* Santé de l'app */}
      <Section title="✅ Santé de l'app">
        <div className="grid gap-3 sm:grid-cols-3">
          <HealthItem label="Base de données" ok={true} detail="Neon PostgreSQL connectée" />
          <HealthItem label="Médailles en stock" ok={unassignedTags > 0} detail={`${unassignedTags} disponibles`} />
          <HealthItem label="Taux d'activation" ok={activationRate > 50} detail={`${activationRate}% des médailles actives`} />
        </div>
      </Section>
    </div>
  );
}

const EVENT_LABELS: Record<string, string> = {
  SCAN: "Scan",
  CALL_CLICK: "Appel",
  SMS_CLICK: "SMS",
  FOUND_CLICK: "Signalement",
};

function StatCard({
  label,
  value,
  sub,
  href,
  color,
}: {
  label: string;
  value: number;
  sub: string;
  href: string;
  color: "blue" | "green" | "orange" | "purple" | "red";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    orange: "bg-orange-50 text-orange-700",
    purple: "bg-purple-50 text-purple-700",
    red: "bg-red-50 text-red-700",
  };
  return (
    <Link href={href} className="rounded-2xl bg-white/70 p-5 transition hover:bg-white block">
      <p className={`text-3xl font-bold ${colors[color].split(" ")[1]}`}>{value}</p>
      <p className="mt-0.5 font-medium text-[var(--color-ink)]">{label}</p>
      <p className="mt-1 text-xs text-[var(--color-ink-soft)]">{sub}</p>
    </Link>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/70 p-5">
      <h2 className="mb-4 font-semibold text-[var(--color-ink)]">{title}</h2>
      {children}
    </div>
  );
}

function HealthItem({ label, ok, detail }: { label: string; ok: boolean; detail: string }) {
  return (
    <div className={`rounded-xl p-4 ${ok ? "bg-green-50" : "bg-amber-50"}`}>
      <div className="flex items-center gap-2">
        <span>{ok ? "🟢" : "🟡"}</span>
        <span className="font-medium text-[var(--color-ink)]">{label}</span>
      </div>
      <p className="mt-1 text-xs text-[var(--color-ink-soft)]">{detail}</p>
    </div>
  );
}
