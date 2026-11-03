"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { prefersReducedMotion } from "@/lib/a11y";
import { DELIVERABLES, emptyDraft, PROPERTY_TYPES, quoteSchema, STEPS, type Quote, type QuoteDraft } from "@/lib/quote-schema";
import { mailtoLink, quoteSummary, whatsappLink } from "@/lib/whatsapp";
import { site } from "@/content/site";

const STORAGE_KEY = "av-quote-draft";
type Errors = Partial<Record<keyof QuoteDraft, string>>;
type Status = "editing" | "sending" | "sent-email" | "sent-mailto" | "sent-whatsapp" | "error";

/**
 * Three-step quote form (Property → What you need → You). No prices anywhere.
 * Validates each step with zod, saves progress to localStorage, has a honeypot, and finishes
 * with "Send on WhatsApp" (wa.me + summary) or "Send by email" (/api/quote, mailto fallback).
 * Powers both the Contact page and the global slide-over panel.
 */
export function QuoteForm({ compact = false }: { compact?: boolean }) {
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;
  const [draft, setDraft] = useState<QuoteDraft>(emptyDraft);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("editing");
  const [mailto, setMailto] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const startedAt = useRef(0);
  const body = useRef<HTMLDivElement>(null);

  // Restore a saved draft.
  useEffect(() => {
    startedAt.current = Date.now();
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
      if (saved?.draft) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDraft({ ...emptyDraft, ...saved.draft });
        setStep(Math.min(STEPS.length - 1, Math.max(0, Number(saved.step) || 0)));
      }
    } catch {}
  }, []);

  // Progress is saved on user changes only (never on mount, which would clobber the draft).
  const persist = (d: QuoteDraft, s: number) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ draft: d, step: s }));
    } catch {}
  };
  const goTo = (s: number) => {
    setStep(s);
    persist(draft, s);
  };

  // Each step slides in.
  useEffect(() => {
    if (!body.current || prefersReducedMotion()) return;
    gsap.fromTo(body.current, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.7, ease: ease.reveal });
  }, [step, status]);

  const validateStep = (i: number, d = draft) => {
    const r = STEPS[i].schema.safeParse(d);
    const errs: Errors = {};
    if (!r.success) for (const issue of r.error.issues) errs[issue.path[0] as keyof QuoteDraft] ??= issue.message;
    return errs;
  };

  const set = <K extends keyof QuoteDraft>(k: K, v: QuoteDraft[K]) => {
    const next = { ...draft, [k]: v };
    setDraft(next);
    persist(next, step);
    // Once a field has shown an error, re-check it live.
    if (errors[k]) setErrors((e) => ({ ...e, [k]: validateStep(step, next)[k] }));
  };

  const focusFirstError = (errs: Errors) => {
    const first = Object.keys(errs)[0];
    if (first) requestAnimationFrame(() => document.getElementById(id(first))?.focus());
  };

  const next = () => {
    const errs = validateStep(step);
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstError(errs);
    goTo(step + 1);
  };

  const finalQuote = (): Quote | null => {
    const errs = validateStep(step);
    setErrors(errs);
    if (Object.keys(errs).length) {
      focusFirstError(errs);
      return null;
    }
    const r = quoteSchema.safeParse(draft);
    return r.success ? r.data : null;
  };

  const done = (s: Status) => {
    setStatus(s);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const sendWhatsApp = () => {
    const q = finalQuote();
    if (!q) return;
    window.open(whatsappLink(quoteSummary(q)), "_blank", "noopener,noreferrer");
    done("sent-whatsapp");
  };

  const sendEmail = async () => {
    const q = finalQuote();
    if (!q) return;
    setStatus("sending");
    const text = quoteSummary(q);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...q, website: honeypot, startedAt: startedAt.current }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) return done("sent-email");
      // Email not configured: hand over to the visitor's mail app. Provider failure: offer the same.
      const link = mailtoLink(q, text);
      setMailto(link);
      if (json.reason === "not-configured") {
        window.location.href = link;
        return done("sent-mailto");
      }
      setStatus("error");
    } catch {
      setMailto(mailtoLink(q, text));
      setStatus("error");
    }
  };

  const reset = () => {
    setDraft(emptyDraft);
    setStep(0);
    setErrors({});
    setStatus("editing");
    setMailto(null);
  };

  if (status === "sent-email" || status === "sent-mailto" || status === "sent-whatsapp") {
    return (
      <div ref={body} className="py-6" role="status">
        <SuccessCheck />
        <p className="t-h3 mt-8 max-w-[22ch]">Thanks — we&rsquo;ll come back with a quote within {site.replyHours} hours.</p>
        <p className="t-body mt-4">
          {status === "sent-whatsapp"
            ? "WhatsApp has opened with your message ready. Hit send there and it’s with us."
            : status === "sent-mailto"
              ? "Your email app has opened with the details. Send it from there and it’s with us."
              : "Your request is on its way to the studio."}
        </p>
        <button type="button" onClick={reset} className="t-label mt-10 min-h-[44px] border-b border-fg">
          Start another quote
        </button>
      </div>
    );
  }

  const last = step === STEPS.length - 1;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!last) next();
      }}
      aria-labelledby={id("title")}
    >
      {/* Progress */}
      <div className="flex items-baseline justify-between gap-4">
        <p id={id("title")} className="t-label">
          <span className="t-num">{String(step + 1).padStart(2, "0")}</span>
          <span className="text-fg-40"> / {String(STEPS.length).padStart(2, "0")}</span>
          <span className="ml-3">{STEPS[step].label}</span>
        </p>
        <p className="t-label text-fg-40">No obligation · No prices online</p>
      </div>
      <div className="relative mt-4 h-px bg-fg-14" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1} aria-label="Quote progress">
        <span className="absolute inset-0 origin-left bg-fg transition-transform duration-700 ease-[var(--ease-out)]" style={{ transform: `scaleX(${(step + 1) / STEPS.length})` }} />
      </div>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("website")}>Website</label>
        <input id={id("website")} name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <div ref={body} className={`grid gap-x-6 gap-y-8 ${compact ? "mt-10" : "mt-12"} sm:grid-cols-2`}>
        {step === 0 && (
          <>
            <Field id={id("address")} label="Street address" error={errors.address} className="sm:col-span-2">
              <input id={id("address")} value={draft.address} onChange={(e) => set("address", e.target.value)} autoComplete="street-address" className={inputCls} {...aria(errors.address, id("address"))} />
            </Field>
            <Field id={id("suburb")} label="Suburb" error={errors.suburb}>
              <input id={id("suburb")} value={draft.suburb} onChange={(e) => set("suburb", e.target.value)} autoComplete="address-level2" className={inputCls} {...aria(errors.suburb, id("suburb"))} />
            </Field>
            <Field id={id("bedrooms")} label="Bedrooms (optional)" error={errors.bedrooms}>
              <input id={id("bedrooms")} inputMode="numeric" value={draft.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} className={inputCls} {...aria(errors.bedrooms, id("bedrooms"))} />
            </Field>
            <fieldset className="sm:col-span-2" aria-describedby={errors.propertyType ? `${id("propertyType")}-err` : undefined}>
              <legend className="t-label text-fg-60">Property type</legend>
              <div className="mt-4 flex flex-wrap gap-2" id={id("propertyType")} tabIndex={-1}>
                {PROPERTY_TYPES.map((t) => (
                  <Chip key={t} type="radio" name={id("ptype")} checked={draft.propertyType === t} onChange={() => set("propertyType", t)}>
                    {t}
                  </Chip>
                ))}
              </div>
              <ErrorText id={`${id("propertyType")}-err`} message={errors.propertyType} />
            </fieldset>
          </>
        )}

        {step === 1 && (
          <>
            <fieldset className="sm:col-span-2" aria-describedby={errors.deliverables ? `${id("deliverables")}-err` : undefined}>
              <legend className="t-label text-fg-60">What do you need? Choose any.</legend>
              <div className="mt-4 flex flex-wrap gap-2" id={id("deliverables")} tabIndex={-1}>
                {DELIVERABLES.map((d) => {
                  const on = draft.deliverables.includes(d);
                  return (
                    <Chip key={d} type="checkbox" checked={on} onChange={() => set("deliverables", on ? draft.deliverables.filter((x) => x !== d) : [...draft.deliverables, d])}>
                      {d}
                    </Chip>
                  );
                })}
              </div>
              <ErrorText id={`${id("deliverables")}-err`} message={errors.deliverables} />
            </fieldset>
            <Field id={id("shootDate")} label="Preferred shoot date" error={errors.shootDate}>
              <input id={id("shootDate")} type="date" min={today()} value={draft.shootDate} onChange={(e) => set("shootDate", e.target.value)} className={inputCls} />
            </Field>
            <Field id={id("goLiveDate")} label="Listing goes live (optional)" error={errors.goLiveDate}>
              <input id={id("goLiveDate")} type="date" min={today()} value={draft.goLiveDate} onChange={(e) => set("goLiveDate", e.target.value)} className={inputCls} />
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <Field id={id("name")} label="Name" error={errors.name}>
              <input id={id("name")} value={draft.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" className={inputCls} {...aria(errors.name, id("name"))} />
            </Field>
            <Field id={id("agency")} label="Agency (optional)" error={errors.agency}>
              <input id={id("agency")} value={draft.agency} onChange={(e) => set("agency", e.target.value)} autoComplete="organization" className={inputCls} />
            </Field>
            <Field id={id("phone")} label="Phone" error={errors.phone}>
              <input id={id("phone")} type="tel" value={draft.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" placeholder="021 123 4567" className={inputCls} {...aria(errors.phone, id("phone"))} />
            </Field>
            <Field id={id("email")} label="Email" error={errors.email}>
              <input id={id("email")} type="email" value={draft.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" className={inputCls} {...aria(errors.email, id("email"))} />
            </Field>
            <Field id={id("notes")} label="Notes (optional)" error={errors.notes} className="sm:col-span-2">
              <textarea id={id("notes")} rows={3} value={draft.notes} onChange={(e) => set("notes", e.target.value)} className={`${inputCls} resize-y`} {...aria(errors.notes, id("notes"))} />
            </Field>
          </>
        )}
      </div>

      {status === "error" && (
        <div className="mt-8 border border-fg-20 p-4" role="alert">
          <ErrorText message="We couldn’t send that just now." />
          {mailto && (
            <a href={mailto} className="t-label mt-3 inline-block border-b border-fg">
              Send it from your email app instead
            </a>
          )}
        </div>
      )}

      <div className={`flex flex-wrap items-center gap-3 ${compact ? "mt-10" : "mt-12"}`}>
        {step > 0 && (
          <button type="button" onClick={() => goTo(step - 1)} className="t-label min-h-[48px] px-1 text-fg-60 hover:text-fg">
            ← Back
          </button>
        )}
        <span className="flex-1" />
        {!last ? (
          <button type="submit" className="t-label min-h-[48px] border border-fg bg-fg px-7 text-bg transition-colors hover:bg-transparent hover:text-fg">
            Continue →
          </button>
        ) : (
          <>
            <button type="button" onClick={sendEmail} disabled={status === "sending"} className="t-label min-h-[48px] border border-fg-20 px-6 hover:border-fg disabled:opacity-40">
              {status === "sending" ? "Sending…" : "Send by email"}
            </button>
            <button type="button" onClick={sendWhatsApp} className="t-label min-h-[48px] border border-fg bg-fg px-6 text-bg transition-colors hover:bg-transparent hover:text-fg">
              Send on WhatsApp
            </button>
          </>
        )}
      </div>
    </form>
  );
}

const inputCls =
  "mt-3 block w-full border-0 border-b border-fg-20 bg-transparent px-0 py-3 text-[18px] text-fg outline-none transition-colors placeholder:text-fg-40 focus:border-fg focus-visible:outline-none [color-scheme:dark]";

const today = () => new Date().toLocaleDateString("en-CA", { timeZone: site.timeZone });

const aria = (error: string | undefined, fieldId: string) => ({
  "aria-invalid": error ? true : undefined,
  "aria-describedby": error ? `${fieldId}-err` : undefined,
});

function Field({ id, label, error, className = "", children }: { id: string; label: string; error?: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="t-label text-fg-60">
        {label}
      </label>
      {children}
      <ErrorText id={`${id}-err`} message={error} />
    </div>
  );
}

/** Errors are icon + text in the foreground colour — never red. */
function ErrorText({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-center gap-2 text-[14px] text-fg">
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="shrink-0">
        <path d="M7 1 L13 12 H1 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M7 5.5 V8.5 M7 10 V10.6" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      {message}
    </p>
  );
}

function Chip({ type, name, checked, onChange, children }: { type: "radio" | "checkbox"; name?: string; checked: boolean; onChange: () => void; children: ReactNode }) {
  return (
    <label
      className={`t-label relative inline-flex min-h-[44px] cursor-pointer items-center border px-4 transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-fg ${
        checked ? "border-fg bg-fg text-bg" : "border-fg-20 hover:border-fg-60"
      }`}
    >
      <input type={type} name={name} checked={checked} onChange={onChange} className="sr-only" />
      {children}
    </label>
  );
}

function SuccessCheck() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden className="success-check">
      <rect x="1" y="1" width="62" height="62" fill="none" stroke="currentColor" strokeWidth="1" pathLength={1} className="sc-box" />
      <path d="M18 33 L28 43 L47 22" fill="none" stroke="currentColor" strokeWidth="2" pathLength={1} className="sc-tick" />
    </svg>
  );
}
