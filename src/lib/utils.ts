import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PHONE_DISPLAY = "+1 908-827-6223";
export const PHONE_HREF = "tel:+19088276223";
export const TTY = "TTY 711";
export const HOURS = "Mon–Fri 9am–6pm ET";
export const HQ_LINE1 = "3550 Buschwood Park Dr";
export const HQ_LINE2 = "Ste 180";
export const HQ_CITY = "Tampa, FL 33618";
export const HQ_ONE_LINE = "3550 Buschwood Park Dr, Ste 180, Tampa, FL 33618";
