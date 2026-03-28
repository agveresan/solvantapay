import express from "express";
import cors from "cors";
import { Resend } from "resend";
import { applicationSchema } from "../src/lib/schema.ts";
import { computeIndicativeQuote } from "../src/lib/quote-rules.ts";

const port = Number(process.env.PORT ?? 3001);
const app = express();

const allowed = process.env.ALLOWED_ORIGINS?.split(",").map((s) => s.trim()).filter(Boolean);

app.use(
  cors({
    origin: allowed && allowed.length ? allowed : true,
    methods: ["POST", "OPTIONS"],
  }),
);
app.use(express.json({ limit: "512kb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/apply", async (req, res) => {
  try {
    if (req.body?.honeypot) {
      return res.status(400).json({ error: "Bad request" });
    }
    const raw = { ...req.body };
    delete raw.quote;
    delete raw.honeypot;

    const parsed = applicationSchema.safeParse(raw);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid application" });
    }

    const quote = computeIndicativeQuote(parsed.data);

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM;
    const to = process.env.RESEND_TO ?? parsed.data.email;

    if (!apiKey || !from) {
      console.error("Missing RESEND_API_KEY or RESEND_FROM");
      return res.status(500).json({ error: "Email not configured" });
    }

    const resend = new Resend(apiKey);
    const html = `
      <h2>New Solvanta Pay application</h2>
      <p><strong>Business:</strong> ${escapeHtml(parsed.data.legalBusinessName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(parsed.data.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(parsed.data.phone)}</p>
      <p><strong>Website:</strong> ${escapeHtml(parsed.data.websiteUrl)}</p>
      <p><strong>Volume band:</strong> ${escapeHtml(parsed.data.monthlyVolumeBand)}</p>
      <p><strong>Avg ticket:</strong> ${escapeHtml(String(parsed.data.avgTicketDollars))}</p>
      <p><strong>Industry:</strong> ${escapeHtml(parsed.data.industry)}</p>
      <p><strong>Chargebacks:</strong> ${escapeHtml(parsed.data.chargebackBand)}</p>
      <p><strong>Countries:</strong> ${escapeHtml(parsed.data.countriesSold)}</p>
      <p><strong>Prior processing:</strong> ${escapeHtml(parsed.data.priorProcessing)}</p>
      <hr />
      <p><strong>Indicative quote (server):</strong> ${escapeHtml(quote.summary)}</p>
      <p class="muted">Indicative only — not an offer.</p>
    `;

    await resend.emails.send({
      from,
      to: [to],
      subject: `Application: ${parsed.data.legalBusinessName}`,
      html,
    });

    if (process.env.GHL_WEBHOOK_URL) {
      try {
        await fetch(process.env.GHL_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...parsed.data, quote }),
        });
      } catch (e) {
        console.error("GHL webhook failed", e);
      }
    }

    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
});

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

app.listen(port, () => {
  console.log(`Apply API listening on http://localhost:${port}`);
});
