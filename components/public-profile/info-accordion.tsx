"use client";

import { useState } from "react";

export function InfoAccordion({
  items,
}: {
  items: { label: string; text: string; emphasis?: boolean }[];
}) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <AccordionItem key={item.label} {...item} />
      ))}
    </div>
  );
}

function AccordionItem({
  label,
  text,
  emphasis,
}: {
  label: string;
  text: string;
  emphasis?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`overflow-hidden rounded-2xl ${emphasis ? "bg-[var(--color-alert-soft)]" : "bg-white"}`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left"
      >
        <span className="text-xs font-bold uppercase tracking-wide text-[var(--color-ink-soft)]">
          {label}
        </span>
        <span
          className="ml-3 text-[var(--color-ink-soft)] transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="border-t border-black/5 px-4 pb-4 pt-3">
          <p className="text-[var(--color-ink)]">{text}</p>
        </div>
      )}
    </div>
  );
}
