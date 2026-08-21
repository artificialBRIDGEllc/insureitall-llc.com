import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

const control =
  "mt-1.5 w-full rounded-xl border border-border bg-elevated px-3 py-3 text-ink";

export function Field({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm font-medium text-navy">
      {label}
      <input className={control} {...props} />
    </label>
  );
}

export function AreaField({
  label,
  ...props
}: { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block text-sm font-medium text-navy">
      {label}
      <textarea className={control} {...props} />
    </label>
  );
}

export function SelectField({
  label,
  children,
  ...props
}: { label: string } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block text-sm font-medium text-navy">
      {label}
      <select className={control} {...props}>
        {children}
      </select>
    </label>
  );
}
