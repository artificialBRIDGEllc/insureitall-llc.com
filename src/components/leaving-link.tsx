import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { leavePath, type LeaveDest } from "@/lib/leaving";
import { cn } from "@/lib/utils";

/** IIA chrome must not dump a person onto fileBRIDGE without the leave-site notice. */
export function LeavingLink({
  dest = "filebridge",
  className,
  children,
}: {
  dest?: LeaveDest;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link to="/leaving" search={{ to: dest }} className={cn(className)}>
      {children}
    </Link>
  );
}
