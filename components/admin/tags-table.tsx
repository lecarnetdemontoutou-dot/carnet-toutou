"use client";

import { useState, useTransition } from "react";
import { TagAdminActions } from "./tag-admin-actions";
import { deleteTagsAction } from "@/server/actions/admin-tag.actions";

type Tag = {
  id: string;
  tagCode: string;
  activationCode: string;
  status: string;
  user: { firstName: string; lastName: string } | null;
  pet: { name: string } | null;
};

export function TagsTable({ tags }: { tags: Tag[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();

  const allSelected = tags.length > 0 && selected.size === tags.length;

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(tags.map((t) => t.id)));
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleDeleteSelected() {
    if (!confirm(`Supprimer définitivement ${selected.size} médaille(s) ?`)) return;
    startTransition(async () => {
      await deleteTagsAction(Array.from(selected));
      setSelected(new Set());
    });
  }

  return (
    <div className="space-y-3">
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-2xl bg-red-50 px-4 py-3">
          <span className="text-sm font-medium text-red-700">{selected.size} sélectionnée(s)</span>
          <button
            disabled={pending}
            onClick={handleDeleteSelected}
            className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {pending ? "Suppression…" : "Supprimer la sélection"}
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl bg-white/70">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-ring)] text-left text-[var(--color-ink-soft)]">
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded accent-[var(--color-orange)]"
                />
              </th>
              <th className="px-4 py-3">tagCode</th>
              <th className="px-4 py-3">activationCode</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Propriétaire</th>
              <th className="px-4 py-3">Chien</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <tr
                key={tag.id}
                className={`border-b border-[var(--color-ring)]/50 ${selected.has(tag.id) ? "bg-orange-50" : ""}`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(tag.id)}
                    onChange={() => toggle(tag.id)}
                    className="h-4 w-4 rounded accent-[var(--color-orange)]"
                  />
                </td>
                <td className="px-4 py-3 font-mono text-xs">{tag.tagCode}</td>
                <td className="px-4 py-3 font-mono text-xs">{tag.activationCode}</td>
                <td className="px-4 py-3">{tag.status}</td>
                <td className="px-4 py-3">{tag.user ? `${tag.user.firstName} ${tag.user.lastName}` : "—"}</td>
                <td className="px-4 py-3">{tag.pet?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <TagAdminActions tagId={tag.id} status={tag.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
