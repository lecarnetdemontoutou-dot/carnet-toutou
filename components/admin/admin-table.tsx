export function AdminTable({
  columns,
  rows,
  emptyLabel,
}: {
  columns: string[];
  rows: React.ReactNode[][];
  emptyLabel: string;
}) {
  if (rows.length === 0) {
    return <p className="text-[var(--color-ink-soft)]">{emptyLabel}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-white/70">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-ring)] text-left text-[var(--color-ink-soft)]">
            {columns.map((c) => (
              <th key={c} className="whitespace-nowrap px-4 py-3">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[var(--color-ring)]/50">
              {row.map((cell, j) => (
                <td key={j} className="whitespace-nowrap px-4 py-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
