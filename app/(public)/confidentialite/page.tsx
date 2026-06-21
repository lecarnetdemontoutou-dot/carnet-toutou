import { AuthCard } from "@/components/layout/auth-card";

export default function PrivacyPage() {
  return (
    <AuthCard title="Politique de confidentialité" subtitle="Dernière mise à jour : juin 2026">
      <div className="space-y-5 text-sm text-[var(--color-ink-soft)] leading-relaxed">

        <section>
          <h2 className="font-semibold text-[var(--color-ink)] mb-1">Responsable du traitement</h2>
          <p>La médaille de mon Toutou, produit par Le Carnet de mon Toutou.<br />Contact : hello@lecarnetdemontoutou.fr</p>
        </section>

        <section>
          <h2 className="font-semibold text-[var(--color-ink)] mb-1">Données collectées</h2>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Compte utilisateur</strong> : prénom, nom, adresse email, mot de passe (chiffré).</li>
            <li><strong>Fiche du chien</strong> : prénom, race, date de naissance, poids, photo, numéro de téléphone d'urgence, adresse, informations vétérinaires, notes médicales et comportementales, signes distinctifs. Ces données sont affichées publiquement sur la page de scan de la médaille.</li>
            <li><strong>Scans de médaille</strong> : date, heure et type d'événement (scan, appel, SMS). Aucune donnée de localisation n'est collectée lors du scan.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-[var(--color-ink)] mb-1">Finalité</h2>
          <p>Les données sont collectées uniquement pour permettre le fonctionnement du service : activer la médaille, afficher les informations du chien aux personnes qui le trouvent, et contacter le propriétaire en cas de perte.</p>
        </section>

        <section>
          <h2 className="font-semibold text-[var(--color-ink)] mb-1">Base légale</h2>
          <p>Exécution du contrat (article 6.1.b du RGPD) : les données sont nécessaires pour fournir le service commandé. Intérêt légitime (article 6.1.f) : historique des scans pour la sécurité et la prévention des abus.</p>
        </section>

        <section>
          <h2 className="font-semibold text-[var(--color-ink)] mb-1">Données affichées publiquement</h2>
          <p>Les informations renseignées dans la fiche de votre chien sont visibles par toute personne qui scanne votre médaille. Ne renseignez que les données que vous acceptez de rendre publiques. Vous pouvez modifier ou supprimer ces informations à tout moment depuis votre tableau de bord.</p>
        </section>

        <section>
          <h2 className="font-semibold text-[var(--color-ink)] mb-1">Sous-traitants</h2>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Railway Inc.</strong> (États-Unis) — hébergement de l'application</li>
            <li><strong>Neon Inc.</strong> (États-Unis) — base de données</li>
            <li><strong>Cloudinary Inc.</strong> (États-Unis) — stockage des photos</li>
            <li><strong>Brevo SAS</strong> (France) — envoi d'emails transactionnels</li>
          </ul>
          <p className="mt-2">Les transferts vers les États-Unis sont encadrés par des clauses contractuelles types (CCT) conformes au RGPD.</p>
        </section>

        <section>
          <h2 className="font-semibold text-[var(--color-ink)] mb-1">Durée de conservation</h2>
          <ul className="list-disc pl-4 space-y-1">
            <li>Données de compte et fiche chien : jusqu'à la suppression du compte</li>
            <li>Historique des scans : 12 mois glissants</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-[var(--color-ink)] mb-1">Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits d'accès, de rectification, d'effacement, de portabilité et d'opposition. Pour exercer ces droits :</p>
          <ul className="list-disc pl-4 mt-1 space-y-1">
            <li>Suppression du compte : directement depuis les <a href="/dashboard/settings" className="underline">réglages de votre compte</a></li>
            <li>Toute autre demande : hello@lecarnetdemontoutou.fr</li>
          </ul>
          <p className="mt-2">Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr).</p>
        </section>

        <section>
          <h2 className="font-semibold text-[var(--color-ink)] mb-1">Cookies</h2>
          <p>Ce site utilise uniquement un cookie de session nécessaire au fonctionnement de votre compte (authentification). Aucun cookie publicitaire ou de tracking n'est utilisé.</p>
        </section>

      </div>
    </AuthCard>
  );
}
