import type { ErrorComponentProps } from "@tanstack/react-router";
import { AppErrorPage } from "@/components/site-status";

export function AppErrorComponent({ error }: ErrorComponentProps) {
  if (import.meta.env.DEV) {
    console.error(error);
  }
  return <AppErrorPage message="hidden" />;
}
