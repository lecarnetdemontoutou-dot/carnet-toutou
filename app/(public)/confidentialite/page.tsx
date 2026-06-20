import { AuthCard } from "@/components/layout/auth-card";

export default function PrivacyPage() {
  return (
    <AuthCard title="Politique de confidentialité" subtitle="Dernière mise à jour : juin 2025">
      <div className="space-y-5 text-sm text-[var(--color-ink-soft)] leading-relaxed">
        <section>
          <h2 className="font-semibold text-[var(--color-ink)] mb-1">Responsable du traitement</h2>
          <p>Le Carnet de mon Toutou — contact : lecarnetdemontoutou@gmail.com</p>
        </section>

        <section>
          <h2 className="font-semibold text-[var(--color-ink)] mb-1">Données collectées</h2>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Comptes utilisateurs</strong> : prénom, nom, email, téléphone, informations sur votre chien.</li>
            <li><strong>Scans de médaille</strong> : adresse IP, pays, ville (approximatif), type d'appareil, date. Ces données servent à vous informer des scans de vos médailles et à prévenir les abus.</li>
            <li><strong>Signalements "J'ai trouvé ce chien"</strong> : prénom et téléphone de la personne ayant trouvé le chien, transmis au propriétaire pour faciliter la restitution.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-[var(--color-ink)] mb-1">Base légale</h2>
          <p>Exécution du contrat (compte utilisateur) et intérêt légitime (scans, sécurité, retrouver les chiens perdus).</p>
        </section>

        <section>
          <h2 className="font-semibold text-[var(--color-ink)] mb-1">Durée de conservation</h2>
          <p>Les données de compte sont conservées jusqu'à la suppression du compte. Les historiques de scan sont conservés 12 mois. Les signalements de trouveurs sont conservés jusqu'à la suppression de la fiche du chien.</p>
        </section>

        <section>
          <h2 className="font-semibold text-[var(--color-ink)] mb-1">Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits d'accès, de rectification, d'effacement, de portabilité et d'opposition. Vous pouvez supprimer votre compte à tout moment depuis les <a href="/dashboard/settings" className="underline">réglages</a> ou en contactant lecarnetdemontoutou@gmail.com.</p>
        </section>

        <section>
          <h2 className="font-semibold text-[var(--color-ink)] mb-1">Hébergement</h2>
          <p>Application hébergée sur Railway (États-Unis) avec base de données Neon PostgreSQL (UE). Les données sont protégées par des clauses contractuelles standard conformes au RGPD.</p>
        </section>
      </div>
    </AuthCard>
  );
}
