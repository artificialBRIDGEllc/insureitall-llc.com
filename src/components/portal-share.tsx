import { useState, type FormEvent } from "react";
import { openPortalShare, type OpenedFile } from "@/lib/portal";
import { Field } from "@/components/field";
import { Button } from "@/components/ui/button";

export function TeamShareLookup() {
  const [code, setCode] = useState("");
  const [opened, setOpened] = useState<OpenedFile | null>(null);
  const [openError, setOpenError] = useState<string | null>(null);

  async function open(e: FormEvent) {
    e.preventDefault();
    setOpenError(null);
    setOpened(null);
    try {
      const file = await openPortalShare({ data: { id: code } });
      if (!file) setOpenError("That code is not active.");
      else setOpened(file);
    } catch {
      setOpenError("Team sign-in required.");
    }
  }

  return (
    <div className="card-elevated rounded-3xl bg-elevated p-6 sm:p-8">
        <h3 className="font-display text-2xl text-navy">Open a beneficiary file</h3>
        <p className="mt-1 text-sm text-ink">
          artificialBRIDGE portal. Access is scoped by the beneficiary’s express
          consent. Fields they did not grant will be blank.
        </p>
        <form onSubmit={open} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <Field
              label="Share code"
              name="share-code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="AB-XXXXXX"
              autoComplete="off"
            />
          </div>
          <Button type="submit" className="sm:mt-7" variant="navy">
            Open file
          </Button>
        </form>
        {openError ? <p className="mt-3 text-sm text-blue">{openError}</p> : null}
        {opened ? (
          <div className="mt-6 space-y-2 rounded-2xl bg-soft p-5 text-sm text-ink">
            <p className="text-xs font-semibold tracking-[0.14em] text-blue uppercase">
              artificialBRIDGE file · {opened.audience}
              {opened.label ? ` · ${opened.label}` : ""}
            </p>
            {opened.withheld.length > 0 ? (
              <p className="text-xs text-muted">
                Not consented: {opened.withheld.join(", ")}
              </p>
            ) : null}
            <p>
              <span className="font-medium text-navy">Zip:</span> {opened.zip || "—"}
            </p>
            <p>
              <span className="font-medium text-navy">Doctors:</span>{" "}
              {opened.doctors || "—"}
            </p>
            <p>
              <span className="font-medium text-navy">Medications:</span>{" "}
              {opened.medications || "—"}
            </p>
            <p>
              <span className="font-medium text-navy">Budget:</span>{" "}
              {opened.budget || "—"}
            </p>
            <p>
              <span className="font-medium text-navy">Notes:</span> {opened.notes || "—"}
            </p>
          </div>
        ) : null}
    </div>
  );
}
