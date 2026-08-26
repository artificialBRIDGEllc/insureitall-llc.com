import { useEffect, useState, type FormEvent } from "react";
import { getPortalProfile, savePortalProfile } from "@/lib/portal";
import { IdentMark } from "@/components/ident-mark";
import { AreaField, Field, SelectField } from "@/components/field";
import { Button } from "@/components/ui/button";

export function PortalFile() {
  const [zip, setZip] = useState("");
  const [doctors, setDoctors] = useState("");
  const [medications, setMedications] = useState("");
  const [budget, setBudget] = useState("unsure");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "saving" | "saved" | "error">(
    "loading",
  );

  useEffect(() => {
    let live = true;
    getPortalProfile()
      .then((profile) => {
        if (!live || !profile) return;
        setZip(profile.zip);
        setDoctors(profile.doctors);
        setMedications(profile.medications);
        setBudget(profile.budget || "unsure");
        setNotes(profile.notes);
        setStatus("ready");
      })
      .catch(() => {
        if (live) setStatus("ready");
      });
    return () => {
      live = false;
    };
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    try {
      await savePortalProfile({
        data: { role: "client", zip, doctors, medications, budget, notes },
      });
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-navy px-6 py-12" role="status">
        <IdentMark compact play />
        <p className="mt-4 text-sm text-elevated/70">Loading your file…</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field
        label="Zip code"
        name="zip"
        value={zip}
        onChange={(e) => setZip(e.target.value)}
        inputMode="numeric"
        autoComplete="postal-code"
      />
      <AreaField
        label="Doctors you want to keep (optional)"
        name="doctors"
        rows={2}
        value={doctors}
        onChange={(e) => setDoctors(e.target.value)}
      />
      <AreaField
        label="Medications (optional)"
        name="medications"
        rows={2}
        value={medications}
        onChange={(e) => setMedications(e.target.value)}
      />
      <p className="text-xs text-muted">
        Names only, if you want them on file with INSUREitALL. Never a Medicare
        number or Social Security number.
      </p>
      <SelectField
        label="Monthly budget comfort"
        name="budget"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
      >
        <option value="low">Keep premiums as low as possible</option>
        <option value="mid">Balance premium and copays</option>
        <option value="high">Predictable costs matter most</option>
        <option value="unsure">Not sure yet</option>
      </SelectField>
      <AreaField
        label="Notes for you (and anyone you later choose to share with)"
        name="notes"
        rows={3}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <Button type="submit" className="w-full" disabled={status === "saving"}>
        {status === "saving" ? "Saving…" : "Save my file"}
      </Button>
      {status === "saved" ? (
        <p className="text-sm text-navy">Saved to your account — not to an agency silo.</p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-blue">Could not save. Sign in again and retry.</p>
      ) : null}
    </form>
  );
}
