import { useState } from "react";
import { deletePortalAccount, exportPortalFile } from "@/lib/portal";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function PortalRights() {
  const [busy, setBusy] = useState<"export" | "delete" | null>(null);
  const [confirm, setConfirm] = useState("");
  const [note, setNote] = useState<string | null>(null);

  async function download() {
    setBusy("export");
    setNote(null);
    try {
      const pack = await exportPortalFile();
      const blob = new Blob([JSON.stringify(pack, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "filebridge-export.json";
      a.click();
      URL.revokeObjectURL(url);
      setNote("Download started.");
    } catch {
      setNote("Could not export. Try again.");
    } finally {
      setBusy(null);
    }
  }

  async function wipe() {
    setBusy("delete");
    setNote(null);
    try {
      await deletePortalAccount({ data: { confirm } });
      setConfirm("");
      setNote("File cleared. Agency access revoked. Consent log kept as promised.");
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Could not delete.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="mt-8 rounded-[14px] border border-[var(--ab-border,#d7e0ea)] p-5 text-sm">
      <p className="text-xs font-semibold tracking-[0.14em] uppercase">your rights</p>
      <p className="mt-2 max-w-xl">
        Download a copy or clear the file. That is the access and delete path in
        the{" "}
        <Link to="/ab/privacy" className="underline">
          artificialBRIDGE privacy policy
        </Link>
        . Consent history is kept up to three years.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button type="button" variant="outline" disabled={busy !== null} onClick={() => void download()}>
          {busy === "export" ? "Exporting…" : "Download my file"}
        </Button>
      </div>
      <div className="mt-5 flex flex-wrap items-end gap-3">
        <label className="text-xs">
          type DELETE
          <input
            className="mt-1 block rounded-xl border border-border bg-transparent px-3 py-2"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="off"
          />
        </label>
        <Button
          type="button"
          variant="outline"
          disabled={busy !== null || confirm.toUpperCase() !== "DELETE"}
          onClick={() => void wipe()}
        >
          {busy === "delete" ? "Clearing…" : "Clear my file"}
        </Button>
      </div>
      {note ? <p className="mt-3 text-xs">{note}</p> : null}
    </section>
  );
}
