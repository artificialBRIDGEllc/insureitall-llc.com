import { Link } from "@tanstack/react-router";
import { LEAD_CONSENT } from "@/lib/compliance";

export function LeadConsent({
  checked,
  onChange,
  id = "lead-consent",
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  id?: string;
}) {
  return (
    <div className="flex gap-3">
      <input
        id={id}
        name="consent"
        type="checkbox"
        required
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 shrink-0 accent-blue"
      />
      <label htmlFor={id} className="text-xs leading-relaxed text-muted">
        {LEAD_CONSENT}{" "}
        <Link to="/privacy" className="text-blue underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </label>
    </div>
  );
}
