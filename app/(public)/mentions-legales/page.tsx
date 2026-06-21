import { AuthCard } from "@/components/layout/auth-card";

export default function LegalPage() {
  return (
    <AuthCard title="Mentions légales" subtitle="">
      <div className="space-y-5 text-sm text-[var(--color-ink-soft)] leading-relaxed">
        <section>
          <h2 className="font-semibold text-[var(--color-ink)] mb-1">Éditeur</h2>
          <p>La médaille de mon Toutou<br />Produit par Le Carnet de mon Toutou<br />Activité exercée en tant que particulier<br />Contact : lecarnetdemontoutou@gmail.com</p>
        </section>

        <section>
          <h2 className="font-semibold text-[var(--color-ink)] mb-1">Hébergement</h2>
          <p>Railway Inc. — 548 Market St, San Francisco, CA 94104, États-Unis<br />Base de données : Neon Inc.</p>
        </section>

        <section>
          <h2 className="font-semibold text-[var(--color-ink)] mb-1">Propriété intellectuelle</h2>
          <p>L'ensemble du contenu de ce site (textes, visuels, identité graphique) est la propriété de La médaille de mon Toutou / Le Carnet de mon Toutou. Toute reproduction est interdite sans autorisation préalable.</p>
        </section>

        <section>
          <h2 className="font-semibold text-[var(--color-ink)] mb-1">Responsabilité</h2>
          <p>La médaille de mon Toutou ne peut être tenue responsable en cas d'impossibilité temporaire d'accès au service, ni des conséquences liées à un usage inapproprié des données affichées sur les profils publics.</p>
        </section>
      </div>
    </AuthCard>
  );
}
