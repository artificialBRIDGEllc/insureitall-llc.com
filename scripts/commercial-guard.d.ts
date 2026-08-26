export function digits(value: unknown): string;
export function normalizePhone(value: unknown): string;
export function validPhone(value: unknown): boolean;
export function validEmail(value: unknown): boolean;
export function validZip(value: unknown): boolean;

export function parsePublicLead(
  input: Record<string, unknown>,
  opts?: { now?: number },
):
  | { ok: true; ignored: true }
  | { ok: false; error: string; status: number }
  | {
      ok: true;
      data: {
        kind: "callback" | "needs";
        firstName: string;
        phone: string;
        email: string;
        zip: string;
        callbackWindow: string;
        doctors: string;
        medications: string;
        budget: string;
        notes: string;
        consent: true;
        takenAt: number;
      };
    };

export function takeLeadSlot(
  key: string,
  opts?: { now?: number; limit?: number; windowMs?: number },
): { ok: true; remaining: number } | { ok: false; error: string; status: number };

export function resetLeadSlots(): void;
