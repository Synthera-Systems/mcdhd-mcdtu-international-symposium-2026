// src/lib/registrationDeadline.ts
// Single source of truth for the registration cut-off dates.
// All deadlines are "midnight" at the END of the given day, Indian Standard Time (UTC+05:30).

/** Online registration closes at 18 Oct 2026, 23:59:59 IST. */
export const ONLINE_REGISTRATION_DEADLINE = new Date("2026-10-19T00:00:00+05:30");

/** Registration requests via email are accepted until 20 Oct 2026, 23:59:59 IST. */
export const EMAIL_REGISTRATION_DEADLINE = new Date("2026-10-21T00:00:00+05:30");

export const REGISTRATION_CONTACT_EMAIL = "mitocansypm2026@gmail.com";

export type RegistrationPhase = "ONLINE_OPEN" | "EMAIL_ONLY" | "CLOSED";

export function getRegistrationPhase(now: Date = new Date()): RegistrationPhase {
  if (now < ONLINE_REGISTRATION_DEADLINE) return "ONLINE_OPEN";
  if (now < EMAIL_REGISTRATION_DEADLINE) return "EMAIL_ONLY";
  return "CLOSED";
}

export function isOnlineRegistrationOpen(now: Date = new Date()): boolean {
  return getRegistrationPhase(now) === "ONLINE_OPEN";
}
