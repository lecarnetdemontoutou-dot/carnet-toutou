export function MarqueeBanner() {
  const text = "Fabriquée en France   •   Modèle breveté   •   Plastique recyclé   •   ";
  return (
    <div className="overflow-hidden bg-[var(--color-blue)] py-3">
      <p className="animate-marquee whitespace-nowrap text-sm font-bold uppercase tracking-widest text-white">
        {text.repeat(6)}
      </p>
    </div>
  );
}
