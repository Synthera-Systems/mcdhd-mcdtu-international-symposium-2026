"use client";

import { useEffect, useState } from "react";
import {
  getRegistrationPhase,
  REGISTRATION_CONTACT_EMAIL,
  type RegistrationPhase,
} from "@/lib/registrationDeadline";

const MESSAGES: Record<RegistrationPhase, string> = {
  ONLINE_OPEN:
    `Online registration deadline extended till 18th October midnight. After that, registration requests will be accepted via email only (${REGISTRATION_CONTACT_EMAIL}) till 20th October midnight.`,
  EMAIL_ONLY:
    `Online registration is now closed. Registration requests are accepted via email only (${REGISTRATION_CONTACT_EMAIL}) till 20th October midnight.`,
  CLOSED:
    "Registration for MitoCan-Symposium 2026 is now closed. Thank you for the overwhelming response.",
};

export default function DeadlineMarquee() {
  // Start from the current phase, then re-check every minute so the message
  // flips automatically when a deadline passes while the page is open.
  const [phase, setPhase] = useState<RegistrationPhase>(() => getRegistrationPhase());

  useEffect(() => {
    const tick = () => setPhase(getRegistrationPhase());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  const message = MESSAGES[phase];
  const isUrgent = phase !== "CLOSED";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`w-full border-b overflow-hidden ${
        isUrgent
          ? "bg-amber-400 text-primary border-amber-500/60"
          : "bg-primary-container text-on-primary border-primary/30"
      }`}
    >
      <div className="flex items-stretch">
        {/* Static label so the key word stays visible even while the text scrolls */}
        <div className={`flex items-center gap-1.5 shrink-0 px-3 sm:px-4 py-2 font-inter font-bold uppercase tracking-widest text-[10px] sm:text-xs ${isUrgent ? "bg-primary text-amber-300" : "bg-primary/90 text-white"}`}>
          <span className="relative flex h-2 w-2 shrink-0">
            {isUrgent && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isUrgent ? "bg-amber-300" : "bg-secondary-container"}`} />
          </span>
          <span className="hidden sm:inline">Notice</span>
        </div>

        {/* Scrolling track */}
        <div className="relative flex-1 overflow-hidden flex items-center">
          <div className="deadline-marquee-track flex w-max items-center" aria-hidden="false">
            {[0, 1].map((copy) => (
              <p
                key={copy}
                aria-hidden={copy === 1}
                className="font-inter font-bold text-[13px] sm:text-sm md:text-base whitespace-nowrap py-2.5 sm:py-2 pr-16 sm:pr-24"
              >
                {message}
              </p>
            ))}
          </div>
          {/* Fade edges */}
          <div className={`pointer-events-none absolute inset-y-0 left-0 w-6 sm:w-10 bg-gradient-to-r ${isUrgent ? "from-amber-400" : "from-primary-container"} to-transparent`} />
          <div className={`pointer-events-none absolute inset-y-0 right-0 w-6 sm:w-10 bg-gradient-to-l ${isUrgent ? "from-amber-400" : "from-primary-container"} to-transparent`} />
        </div>
      </div>
    </div>
  );
}
