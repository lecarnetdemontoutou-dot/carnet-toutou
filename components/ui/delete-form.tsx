"use client";

export function DeleteForm({
  action,
  confirmMessage,
  label,
  className,
}: {
  action: () => Promise<void>;
  confirmMessage: string;
  label: string;
  className?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
      className={className}
    >
      <button type="submit" className="mt-4 rounded-full bg-[var(--color-alert)] px-5 py-2.5 text-sm font-semibold text-white">
        {label}
      </button>
    </form>
  );
}
