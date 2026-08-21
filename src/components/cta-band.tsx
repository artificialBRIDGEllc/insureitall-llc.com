import { Link } from "@tanstack/react-router";
import { CallLink } from "@/components/call-link";
import { Button } from "@/components/ui/button";
import { PHONE_DISPLAY } from "@/lib/utils";

export function CtaBand() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="rounded-3xl bg-navy px-6 py-12 text-center text-elevated sm:px-12">
        <h2 className="font-display text-3xl">Let's make Medicare simple.</h2>
        <p className="mx-auto mt-3 max-w-lg text-elevated/80">
          Call a licensed agent, or request a call back. No cost. No pressure.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" variant="blue">
            <CallLink>Call {PHONE_DISPLAY}</CallLink>
          </Button>
          <Button asChild size="lg" variant="soft">
            <Link to="/lead">Request a Call Back</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
