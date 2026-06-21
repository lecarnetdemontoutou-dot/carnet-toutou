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
  const [open, setOpen] = useState(true);

  return (
    <div
      className={`overflow-hidden rounded-2xl ${emphasis ? "bg-red-600" : "bg-white"}`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left"
      >
        <span className={`text-xs font-bold uppercase tracking-wide ${emphasis ? "text-white" : "text-[var(--color-ink-soft)]"}`}>
          {label}
        </span>
        <span
          className={`ml-3 transition-transform duration-200 ${emphasis ? "text-white" : "text-[var(--color-ink-soft)]"}`}
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className={`border-t px-4 pb-4 pt-3 ${emphasis ? "border-white/20" : "border-black/5"}`}>
          <p className={emphasis ? "text-white" : "text-[var(--color-ink)]"}>{text}</p>
        </div>
      )}
    </div>
  );
}
