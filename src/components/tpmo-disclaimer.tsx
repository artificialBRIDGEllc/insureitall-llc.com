import { cn } from "@/lib/utils";
import { NON_AFFILIATION, TPMO_DISCLAIMER } from "@/lib/compliance";

export function TpmoDisclaimer({
  className,
  withNonAffiliation = false,
}: {
  className?: string;
  withNonAffiliation?: boolean;
}) {
  return (
    <div className={cn("space-y-2 text-xs leading-relaxed", className)}>
      <p>{TPMO_DISCLAIMER}</p>
      {withNonAffiliation ? <p>{NON_AFFILIATION}</p> : null}
    </div>
  );
}
