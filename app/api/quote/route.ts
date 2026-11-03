import { Resend } from "resend";
import { quoteSchema } from "@/lib/quote-schema";
import { quoteSummary } from "@/lib/whatsapp";

/**
 * POST /api/quote — validates the quote and emails it via Resend.
 * When Resend isn't configured it answers { fallback: "mailto" } (200, so the console stays clean)
 * and the client hands over to the visitor's mail app.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  // Bots: a filled honeypot or an instant submit gets a quiet "ok" and goes nowhere.
  const startedAt = Number(body.startedAt);
  if (body.website || (Number.isFinite(startedAt) && Date.now() - startedAt < 3000)) {
    return Response.json({ ok: true });
  }

  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: "Some details are missing", issues: parsed.error.issues.map((i) => i.path.join(".")) }, { status: 422 });
  }

  const { RESEND_API_KEY, QUOTE_TO_EMAIL, QUOTE_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !QUOTE_TO_EMAIL || !QUOTE_FROM_EMAIL) {
    return Response.json({ ok: false, fallback: "mailto", reason: "not-configured" });
  }

  const q = parsed.data;
  const { error } = await new Resend(RESEND_API_KEY).emails.send({
    from: QUOTE_FROM_EMAIL,
    to: QUOTE_TO_EMAIL,
    replyTo: q.email,
    subject: `Quote request — ${q.address}, ${q.suburb}`,
    text: quoteSummary(q),
  });

  if (error) {
    console.error("[quote] Resend error:", error.message);
    return Response.json({ ok: false, fallback: "mailto" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
