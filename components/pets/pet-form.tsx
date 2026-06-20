import type { Pet } from "@prisma/client";

export function PetForm({
  pet,
  action,
  submitLabel,
}: {
  pet?: Pet;
  action: (formData: FormData) => void;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-6">
      <Section title="Informations générales">
        <Field label="Prénom du chien" name="name" defaultValue={pet?.name} required />
        <Field label="Race" name="breed" defaultValue={pet?.breed ?? ""} />
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Date de naissance"
            name="birthDate"
            type="date"
            defaultValue={pet?.birthDate?.toISOString().slice(0, 10) ?? ""}
          />
          <SelectField
            label="Sexe"
            name="sex"
            defaultValue={pet?.sex ?? "UNKNOWN"}
            options={[
              { value: "UNKNOWN", label: "Non renseigné" },
              { value: "MALE", label: "Mâle" },
              { value: "FEMALE", label: "Femelle" },
            ]}
          />
        </div>
        <Field label="Poids (kg)" name="weightKg" type="number" defaultValue={pet?.weightKg ?? ""} />
        <TextAreaField label="Description" name="description" defaultValue={pet?.description ?? ""} />
        <TextAreaField
          label="Message public (affiché sur la page de scan)"
          name="publicMessage"
          defaultValue={pet?.publicMessage ?? ""}
          maxLength={280}
        />
      </Section>

      <Section title="Contact en cas d'urgence">
        <Field label="Téléphone principal" name="emergencyPhone" type="tel" defaultValue={pet?.emergencyPhone ?? ""} />
        <Field label="Téléphone secondaire" name="secondaryPhone" type="tel" defaultValue={pet?.secondaryPhone ?? ""} />
        <Field label="Email de contact" name="contactEmail" type="email" defaultValue={pet?.contactEmail ?? ""} />
        <Field label="Adresse" name="address" defaultValue={pet?.address ?? ""} />
      </Section>

      <Section title="Santé et comportement">
        <Field label="Nom du vétérinaire" name="vetName" defaultValue={pet?.vetName ?? ""} />
        <Field label="Téléphone du vétérinaire" name="vetPhone" type="tel" defaultValue={pet?.vetPhone ?? ""} />
        <TextAreaField label="Notes médicales" name="medicalNotes" defaultValue={pet?.medicalNotes ?? ""} />
        <TextAreaField label="Notes comportementales" name="behaviorNotes" defaultValue={pet?.behaviorNotes ?? ""} />
        <TextAreaField
          label="Consignes en cas d'urgence"
          name="emergencyInstructions"
          defaultValue={pet?.emergencyInstructions ?? ""}
        />
      </Section>

      <button
        type="submit"
        className="w-full rounded-full bg-[var(--color-clay)] px-5 py-3.5 font-semibold text-white transition active:scale-[0.98]"
      >
        {submitLabel}
      </button>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/70 p-5">
      <h2 className="mb-4 font-semibold text-[var(--color-ink)]">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number | null;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-[var(--color-ink-soft)]">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue ?? ""}
        className="mt-1 w-full rounded-xl border border-[var(--color-ring)] bg-white px-3 py-2.5 text-[var(--color-ink)] outline-none focus:border-[var(--color-clay)]"
      />
    </div>
  );
}

function TextAreaField({
  label,
  name,
  defaultValue,
  maxLength,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-[var(--color-ink-soft)]">{label}</label>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        maxLength={maxLength}
        rows={3}
        className="mt-1 w-full rounded-xl border border-[var(--color-ring)] bg-white px-3 py-2.5 text-[var(--color-ink)] outline-none focus:border-[var(--color-clay)]"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="text-sm font-medium text-[var(--color-ink-soft)]">{label}</label>
      <select
        name={name}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-xl border border-[var(--color-ring)] bg-white px-3 py-2.5 text-[var(--color-ink)] outline-none focus:border-[var(--color-clay)]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
