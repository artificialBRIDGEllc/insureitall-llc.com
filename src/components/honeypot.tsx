/** Hidden field. Bots fill it; humans never see it. */
export function Honeypot({ name = "website" }: { name?: string }) {
  return (
    <div className="lead-hp" aria-hidden="true">
      <label>
        Company website
        <input name={name} type="text" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
