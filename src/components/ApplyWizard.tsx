import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import {
  applicationSchema,
  step1Schema,
  step2Schema,
  step3Schema,
  type ApplicationPayload,
} from "../lib/schema";
import { computeIndicativeQuote } from "../lib/quote-rules";

const applyUrl = import.meta.env.PUBLIC_APPLY_URL ?? "";

type FormState = {
  legalBusinessName: string;
  email: string;
  phone: string;
  websiteUrl: string;
  monthlyVolumeBand: ApplicationPayload["monthlyVolumeBand"];
  avgTicketDollars: string;
  industry: string;
  chargebackBand: ApplicationPayload["chargebackBand"];
  countriesSold: ApplicationPayload["countriesSold"];
  priorProcessing: ApplicationPayload["priorProcessing"];
  acceptIndicativeTerms: boolean;
  honeypot: string;
};

const initial: FormState = {
  legalBusinessName: "",
  email: "",
  phone: "",
  websiteUrl: "https://",
  monthlyVolumeBand: "under_50k",
  avgTicketDollars: "50",
  industry: "",
  chargebackBand: "unknown",
  countriesSold: "us_only",
  priorProcessing: "first_time",
  acceptIndicativeTerms: false,
  honeypot: "",
};

function fieldErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path.length ? String(issue.path[0]) : "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export default function ApplyWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const preview = useMemo(() => {
    const parsed = applicationSchema.safeParse(toPayload(data));
    if (!parsed.success) return null;
    return computeIndicativeQuote(parsed.data);
  }, [data]);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get("industry");
      if (!raw) return;
      const decoded = decodeURIComponent(raw);
      setData((d) => (d.industry === "" ? { ...d, industry: decoded } : d));
    } catch {
      /* ignore malformed query */
    }
  }, []);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function toPayload(s: FormState): ApplicationPayload {
    return {
      legalBusinessName: s.legalBusinessName,
      email: s.email,
      phone: s.phone,
      websiteUrl: s.websiteUrl,
      monthlyVolumeBand: s.monthlyVolumeBand,
      avgTicketDollars: Number(s.avgTicketDollars),
      industry: s.industry,
      chargebackBand: s.chargebackBand,
      countriesSold: s.countriesSold,
      priorProcessing: s.priorProcessing,
      acceptIndicativeTerms: s.acceptIndicativeTerms,
    };
  }

  function validateStep(current: number) {
    const payload = toPayload(data);
    const schemas = [step1Schema, step2Schema, step3Schema];
    if (current < 0 || current > 2) return true;
    const r = schemas[current].safeParse(payload);
    if (!r.success) {
      setErrors(fieldErrors(r.error));
      return false;
    }
    setErrors({});
    return true;
  }

  async function onSubmit() {
    setServerError(null);
    const parsed = applicationSchema.safeParse(toPayload(data));
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    if (!applyUrl) {
      setServerError("Missing PUBLIC_APPLY_URL. Set it in .env for local development.");
      return;
    }
    if (data.honeypot) {
      setServerError("Unable to submit.");
      return;
    }
    setSubmitting(true);
    try {
      const quote = computeIndicativeQuote(parsed.data);
      const res = await fetch(applyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          honeypot: data.honeypot,
          quote,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Request failed");
      setDone(true);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Application received</h2>
        <p className="muted">
          Thank you. Our team will review your submission and follow up using the contact details you provided.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="wizard-steps" aria-hidden="true">
        {["Basics", "Volume", "Risk", "Review"].map((label, i) => (
          <span key={label} className={"wizard-step-pill" + (i === step ? " is-active" : "")}>
            {i + 1}. {label}
          </span>
        ))}
      </div>

      <div className="card">
        {step === 0 && (
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="legalBusinessName">Legal business name</label>
              <input
                id="legalBusinessName"
                value={data.legalBusinessName}
                onChange={(e) => setField("legalBusinessName", e.target.value)}
              />
              {errors.legalBusinessName && <div className="form-error">{errors.legalBusinessName}</div>}
            </div>
            <div className="form-field">
              <label htmlFor="email">Work email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={data.email}
                onChange={(e) => setField("email", e.target.value)}
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>
            <div className="form-field">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                inputMode="tel"
                value={data.phone}
                onChange={(e) => setField("phone", e.target.value)}
              />
              {errors.phone && <div className="form-error">{errors.phone}</div>}
            </div>
            <div className="form-field">
              <label htmlFor="websiteUrl">Website</label>
              <input
                id="websiteUrl"
                type="url"
                value={data.websiteUrl}
                onChange={(e) => setField("websiteUrl", e.target.value)}
              />
              {errors.websiteUrl && <div className="form-error">{errors.websiteUrl}</div>}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="monthlyVolumeBand">Monthly card volume</label>
              <select
                id="monthlyVolumeBand"
                value={data.monthlyVolumeBand}
                onChange={(e) => setField("monthlyVolumeBand", e.target.value as FormState["monthlyVolumeBand"])}
              >
                <option value="under_50k">Under $50k</option>
                <option value="50k_250k">$50k-$250k</option>
                <option value="250k_1m">$250k-$1M</option>
                <option value="over_1m">Over $1M</option>
              </select>
              {errors.monthlyVolumeBand && <div className="form-error">{errors.monthlyVolumeBand}</div>}
            </div>
            <div className="form-field">
              <label htmlFor="avgTicket">Average ticket (USD)</label>
              <input
                id="avgTicket"
                inputMode="decimal"
                value={data.avgTicketDollars}
                onChange={(e) => setField("avgTicketDollars", e.target.value)}
              />
              {errors.avgTicketDollars && <div className="form-error">{errors.avgTicketDollars}</div>}
            </div>
            <div className="form-field">
              <label htmlFor="industry">Industry / vertical</label>
              <input
                id="industry"
                value={data.industry}
                onChange={(e) => setField("industry", e.target.value)}
                placeholder="e.g., subscription SaaS, nutraceuticals, travel"
              />
              {errors.industry && <div className="form-error">{errors.industry}</div>}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="chargebackBand">Chargeback history (approx.)</label>
              <select
                id="chargebackBand"
                value={data.chargebackBand}
                onChange={(e) => setField("chargebackBand", e.target.value as FormState["chargebackBand"])}
              >
                <option value="under_50bp">Under 50 bps</option>
                <option value="50_100bp">50-100 bps</option>
                <option value="over_100bp">Over 100 bps</option>
                <option value="unknown">Not sure / early stage</option>
              </select>
              {errors.chargebackBand && <div className="form-error">{errors.chargebackBand}</div>}
            </div>
            <div className="form-field">
              <label htmlFor="countriesSold">Where you sell</label>
              <select
                id="countriesSold"
                value={data.countriesSold}
                onChange={(e) => setField("countriesSold", e.target.value as FormState["countriesSold"])}
              >
                <option value="us_only">US only</option>
                <option value="us_ca">US + Canada</option>
                <option value="international">International</option>
              </select>
              {errors.countriesSold && <div className="form-error">{errors.countriesSold}</div>}
            </div>
            <div className="form-field">
              <label htmlFor="priorProcessing">Prior card processing</label>
              <select
                id="priorProcessing"
                value={data.priorProcessing}
                onChange={(e) => setField("priorProcessing", e.target.value as FormState["priorProcessing"])}
              >
                <option value="first_time">First time processing</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              {errors.priorProcessing && <div className="form-error">{errors.priorProcessing}</div>}
            </div>
            <p className="muted" style={{ margin: 0, fontSize: "0.95rem" }}>
              Indicative pricing uses your inputs for orientation only. Underwriting determines final pricing.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="form-grid">
            <div>
              <h3 style={{ marginTop: 0 }}>Review</h3>
              <p className="muted">
                Confirm your details. We will email this application to our team. Nothing here is a binding
                offer.
              </p>
            </div>
            <div className="card" style={{ boxShadow: "none" }}>
              <p style={{ margin: "0 0 0.5rem" }}>
                <strong>{data.legalBusinessName}</strong>
              </p>
              <p className="muted" style={{ margin: 0 }}>
                {data.email} · {data.phone}
              </p>
              <p className="muted" style={{ margin: "0.5rem 0 0" }}>
                {data.websiteUrl}
              </p>
            </div>
            <div className="card" style={{ boxShadow: "none" }}>
              <div className="eyebrow">Indicative quote (non-binding)</div>
              {preview ? (
                <p style={{ margin: "0.75rem 0 0" }}>{preview.summary}</p>
              ) : (
                <p className="muted">Complete required fields to generate an indicative range.</p>
              )}
            </div>
            <label style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
              <input
                type="checkbox"
                checked={data.acceptIndicativeTerms}
                onChange={(e) => setField("acceptIndicativeTerms", e.target.checked)}
              />
              <span>
                I understand this is an indicative range only and final pricing requires underwriting review.
              </span>
            </label>
            {errors.acceptIndicativeTerms && (
              <div className="form-error">{errors.acceptIndicativeTerms}</div>
            )}

            <div className="sr-only" aria-hidden="true">
              <label htmlFor="company">Company</label>
              <input
                id="company"
                tabIndex={-1}
                autoComplete="off"
                value={data.honeypot}
                onChange={(e) => setField("honeypot", e.target.value)}
              />
            </div>

            {serverError && <div className="form-error">{serverError}</div>}
          </div>
        )}

        <div className="wizard-actions">
          {step > 0 && (
            <button type="button" className="btn btn--ghost" onClick={() => setStep((s) => s - 1)}>
              Back
            </button>
          )}
          {step < 3 && (
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => {
                if (validateStep(step)) setStep((s) => s + 1);
              }}
            >
              Continue
            </button>
          )}
          {step === 3 && (
            <button type="button" className="btn btn--primary" disabled={submitting} onClick={onSubmit}>
              {submitting ? "Submitting…" : "Submit application"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
