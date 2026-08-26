import { useState } from "react";
import { BRIDGET_AVATAR } from "@/lib/bridget-assets";
import { cn } from "@/lib/utils";

const items = [
  {
    id: "parts",
    src: "/brand/bridget/clay/parts.jpg",
    slot: "parts",
    label: "Parts A, B, C, D",
    title: "The alphabet soup",
    body: "A is hospital. B is doctor visits. D is drugs. C is the bundled version people call Advantage. You don’t have to memorize the letters — you have to know which ones you actually need.",
  },
  {
    id: "windows",
    src: "/brand/bridget/clay/windows.jpg",
    slot: "windows",
    label: "Enrollment windows",
    title: "When can I even change?",
    body: "October 15 isn’t the only door. Initial enrollment, special enrollment, the fall Annual Enrollment Period — missing a window is usually the expensive part.",
  },
  {
    id: "mail",
    src: "/brand/bridget/clay/mail.jpg",
    slot: "mail",
    label: "The mail pile",
    title: "The mail never stops",
    body: "Plan mailers, “important” postcards, the Annual Notice of Change. Most of it is sales. A few pieces actually matter. I’ll help you tell which is which.",
  },
  {
    id: "gap",
    src: "/brand/bridget/clay/gap.jpg",
    slot: "gap",
    label: "Coverage gap",
    title: "The coverage gap",
    body: "People still call it the doughnut hole. Drug costs can jump mid-year. That’s a plan-design issue, not a personal failing — and it’s worth checking before you enroll.",
  },
  {
    id: "drugs",
    src: "/brand/bridget/clay/drugs.jpg",
    slot: "drugs",
    label: "Drug coverage",
    title: "Will my drugs be covered?",
    body: "Formularies change. So do copays. Bring the bottle list. A licensed agent checks the real plan, not the brochure. I can’t enroll you — I can get you ready.",
  },
  {
    id: "doctor",
    src: "/brand/bridget/clay/doctor.jpg",
    slot: "doctor",
    label: "Keeping your doctor",
    title: "Can I keep my doctor?",
    body: "Original Medicare: usually yes. Advantage: only if they’re in network — and networks move. That’s the question we start with, not the one we skip.",
  },
] as const;

type ItemId = (typeof items)[number]["id"];

export function BridgetOrbit() {
  const [active, setActive] = useState<ItemId | null>(null);
  const current = items.find((item) => item.id === active);

  return (
    <div className="clay-orbit">
      <div className="clay-stage">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            className={cn("clay-item", `clay-slot-${item.slot}`, active === item.id && "is-on")}
            style={{ animationDelay: `${i * 0.35}s` }}
            aria-pressed={active === item.id}
            aria-label={item.label}
            onClick={() => setActive((id) => (id === item.id ? null : item.id))}
          >
            <span className="clay-bob" style={{ animationDelay: `${i * 0.4}s` }}>
              <img src={item.src} alt="" width={256} height={256} />
            </span>
            <span className="clay-tag">{item.label}</span>
          </button>
        ))}
        <div className="clay-figure">
          <img
            src={BRIDGET_AVATAR.figure}
            alt="BRIDGEt, your Medicare advocate"
            width={720}
            height={960}
            decoding="async"
          />
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-elevated/55">
        {current
          ? "Tap again to put it back. She sits in the middle of the mess on purpose."
          : "Tap a piece of the mess. She sits in the middle on purpose."}
      </p>

      {current ? (
        <aside className="clay-note">
          <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">
            BRIDGEt on {current.label}
          </p>
          <h2 className="mt-2 font-display text-2xl text-navy">{current.title}</h2>
          <p className="mt-3 text-ink">{current.body}</p>
        </aside>
      ) : null}
    </div>
  );
}
