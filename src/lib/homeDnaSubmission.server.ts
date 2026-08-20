import { createHmac } from "node:crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { TablesInsert } from "@/integrations/supabase/types";
import type {
  HomeDnaSubmissionInput,
  HomeDnaSubmissionResult,
} from "./homeDnaSubmission.functions";
import type { Locale } from "./i18n";

const CUSTOMER_FROM = "Home DNA™ <porocila@obvestila.nuvelistudio.com>";
const INTERNAL_RECIPIENT = "info@nuvelistudio.com";
const PDF_MAX_BYTES = 15_000_000;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1_000;
const RATE_LIMIT_EMAIL = 3;
const RATE_LIMIT_IP = 8;

type EmailStatus = HomeDnaSubmissionResult["customerEmailStatus"];

type SubmissionRow = {
  id: string;
  locale: Locale;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  answers: HomeDnaSubmissionInput["answers"];
  summary: string;
  report: HomeDnaSubmissionInput["report"];
  customer_email_status: EmailStatus;
  internal_email_status: EmailStatus;
  customer_resend_id: string | null;
  internal_resend_id: string | null;
  attempt_count: number;
};

type SubmissionInsert = TablesInsert<"home_dna_submissions"> & { locale: Locale };

type ResendPayload = {
  from: string;
  to: string[];
  reply_to: string;
  subject: string;
  html: string;
  text: string;
  attachments: Array<{ filename: string; content: string }>;
  tags: Array<{ name: string; value: string }>;
};

const customerCopy = {
  sl: {
    subject: "Vaše Home DNA™ poročilo – Nuveli Studio",
    greeting: "Pozdravljeni",
    heading: "Vaš Home DNA™ Report",
    thankYou: "Hvala, ker ste z nami delili svoj način življenja, potrebe in želje za dom.",
    attachment:
      "Vaše osebno poročilo in okvirna ocena investicije sta priložena temu sporočilu v obliki PDF.",
  },
  hr: {
    subject: "Vaš Home DNA™ izvještaj – Nuveli Studio",
    greeting: "Pozdrav",
    heading: "Vaš Home DNA™ Report",
    thankYou: "Hvala što ste s nama podijelili svoj način života, potrebe i želje za dom.",
    attachment:
      "Vaš osobni izvještaj i okvirna procjena investicije priloženi su ovoj poruci u PDF obliku.",
  },
  en: {
    subject: "Your Home DNA™ Report – Nuveli Studio",
    greeting: "Hello",
    heading: "Your Home DNA™ Report",
    thankYou: "Thank you for sharing your lifestyle, needs and priorities for your home with us.",
    attachment:
      "Your personal report and indicative investment estimate are attached to this email as a PDF.",
  },
} as const;

export async function processHomeDnaSubmission(
  input: HomeDnaSubmissionInput,
  requestIp: string,
): Promise<HomeDnaSubmissionResult> {
  const email = input.contact.email.toLowerCase();
  const ipHash = hashIp(requestIp);
  const pdfSize = estimateBase64Bytes(input.pdfBase64);
  if (pdfSize <= 0 || pdfSize > PDF_MAX_BYTES) throw new Error("HOME_DNA_PDF_TOO_LARGE");

  let submission = await findSubmission(input.submissionId);

  if (!submission) {
    await enforceRateLimit(email, ipHash);
    submission = await createSubmission(input, email, ipHash);
  } else if (submission.customer_email !== email) {
    throw new Error("HOME_DNA_SUBMISSION_MISMATCH");
  }

  if (submission.customer_email_status === "sent" && submission.internal_email_status === "sent") {
    return resultFor(submission);
  }

  const resendApiKey = process.env["RESEND_API_KEY"];
  if (!resendApiKey) {
    await markConfigurationFailure(submission.id, submission.attempt_count);
    return {
      submissionId: submission.id,
      delivered: false,
      customerEmailStatus: submission.customer_email_status === "sent" ? "sent" : "failed",
      internalEmailStatus: submission.internal_email_status === "sent" ? "sent" : "failed",
    };
  }

  await updateSubmission(submission.id, {
    send_status: "processing",
    attempt_count: submission.attempt_count + 1,
    last_error: null,
  });

  let customerStatus = submission.customer_email_status;
  let internalStatus = submission.internal_email_status;
  let customerResendId = submission.customer_resend_id;
  let internalResendId = submission.internal_resend_id;
  const errors: string[] = [];

  if (customerStatus !== "sent") {
    try {
      customerResendId = await sendResendEmail(
        resendApiKey,
        buildCustomerEmail(submission, input.pdfFilename, input.pdfBase64),
        `home-dna-${submission.id}-customer`,
      );
      customerStatus = "sent";
      await updateSubmission(submission.id, {
        customer_email_status: "sent",
        customer_resend_id: customerResendId,
      });
    } catch (error) {
      customerStatus = "failed";
      errors.push(`customer: ${safeErrorMessage(error)}`);
      await updateSubmission(submission.id, { customer_email_status: "failed" });
    }
  }

  if (internalStatus !== "sent") {
    try {
      internalResendId = await sendResendEmail(
        resendApiKey,
        buildInternalEmail(submission, input.pdfFilename, input.pdfBase64),
        `home-dna-${submission.id}-internal`,
      );
      internalStatus = "sent";
      await updateSubmission(submission.id, {
        internal_email_status: "sent",
        internal_resend_id: internalResendId,
      });
    } catch (error) {
      internalStatus = "failed";
      errors.push(`internal: ${safeErrorMessage(error)}`);
      await updateSubmission(submission.id, { internal_email_status: "failed" });
    }
  }

  const delivered = customerStatus === "sent" && internalStatus === "sent";
  const sendStatus = delivered
    ? "sent"
    : customerStatus === "sent" || internalStatus === "sent"
      ? "partial"
      : "failed";

  await updateSubmission(submission.id, {
    send_status: sendStatus,
    customer_email_status: customerStatus,
    internal_email_status: internalStatus,
    customer_resend_id: customerResendId,
    internal_resend_id: internalResendId,
    last_error: errors.length ? errors.join(" | ").slice(0, 2_000) : null,
  });

  return {
    submissionId: submission.id,
    delivered,
    customerEmailStatus: customerStatus,
    internalEmailStatus: internalStatus,
  };
}

async function findSubmission(id: string): Promise<SubmissionRow | null> {
  const { data, error } = await supabaseAdmin
    .from("home_dna_submissions")
    .select(
      "id, locale, customer_name, customer_email, customer_phone, answers, summary, report, customer_email_status, internal_email_status, customer_resend_id, internal_resend_id, attempt_count",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Home DNA submission lookup failed", { id, code: error.code });
    throw new Error("HOME_DNA_STORAGE_UNAVAILABLE");
  }
  return data as SubmissionRow | null;
}

async function createSubmission(
  input: HomeDnaSubmissionInput,
  email: string,
  ipHash: string,
): Promise<SubmissionRow> {
  const { data, error } = (await supabaseAdmin
    .from("home_dna_submissions")
    .insert({
      id: input.submissionId,
      locale: input.locale,
      customer_name: input.contact.name,
      customer_email: email,
      customer_phone: input.contact.phone,
      consent: true,
      consent_at: new Date().toISOString(),
      answers: input.answers,
      summary: input.summary,
      report: input.report,
      request_ip_hash: ipHash,
      send_status: "processing",
      customer_email_status: "pending",
      internal_email_status: "pending",
    } as any)
    .select(
      "id, locale, customer_name, customer_email, customer_phone, answers, summary, report, customer_email_status, internal_email_status, customer_resend_id, internal_resend_id, attempt_count",
    )
    .single()) as { data: unknown; error: { code?: string; message: string } | null };

  if (error) {
    if (error.code === "23505") {
      const existing = await findSubmission(input.submissionId);
      if (existing) return existing;
    }
    console.error("Home DNA submission insert failed", {
      id: input.submissionId,
      code: error.code,
    });
    throw new Error("HOME_DNA_STORAGE_UNAVAILABLE");
  }
  return data as SubmissionRow;
}

async function enforceRateLimit(email: string, ipHash: string): Promise<void> {
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  const [emailResult, ipResult] = await Promise.all([
    supabaseAdmin
      .from("home_dna_submissions")
      .select("id", { count: "exact", head: true })
      .eq("customer_email", email)
      .gte("created_at", since),
    supabaseAdmin
      .from("home_dna_submissions")
      .select("id", { count: "exact", head: true })
      .eq("request_ip_hash", ipHash)
      .gte("created_at", since),
  ]);

  if (emailResult.error || ipResult.error) {
    console.error("Home DNA rate-limit query failed", {
      emailCode: emailResult.error?.code,
      ipCode: ipResult.error?.code,
    });
    throw new Error("HOME_DNA_STORAGE_UNAVAILABLE");
  }

  if ((emailResult.count ?? 0) >= RATE_LIMIT_EMAIL || (ipResult.count ?? 0) >= RATE_LIMIT_IP) {
    throw new Error("HOME_DNA_RATE_LIMITED");
  }
}

async function markConfigurationFailure(id: string, attemptCount: number): Promise<void> {
  await updateSubmission(id, {
    send_status: "failed",
    customer_email_status: "failed",
    internal_email_status: "failed",
    attempt_count: attemptCount + 1,
    last_error: "RESEND_API_KEY is not configured",
  });
}

async function updateSubmission(id: string, patch: Record<string, unknown>): Promise<void> {
  const { error } = await supabaseAdmin
    .from("home_dna_submissions")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) {
    console.error("Home DNA submission update failed", { id, code: error.code });
    throw new Error("HOME_DNA_STORAGE_UNAVAILABLE");
  }
}

function buildCustomerEmail(
  submission: SubmissionRow,
  filename: string,
  pdfBase64: string,
): ResendPayload {
  const copy = customerCopy[submission.locale] ?? customerCopy.sl;
  const name = escapeHtml(submission.customer_name);
  return {
    from: CUSTOMER_FROM,
    to: [submission.customer_email],
    reply_to: INTERNAL_RECIPIENT,
    subject: copy.subject,
    html: emailLayout(
      submission.locale,
      `<p style="margin:0 0 18px">${copy.greeting}, ${name}.</p>
       <h1 style="font-size:28px;line-height:1.2;margin:0 0 18px;color:#1a1a18">${copy.heading}</h1>
       <p style="margin:0 0 16px">${copy.thankYou}</p>
       <p style="margin:0 0 16px">${copy.attachment}</p>
       <p style="margin:28px 0 0">Nuveli Studio<br><a href="mailto:${INTERNAL_RECIPIENT}" style="color:#76624b">${INTERNAL_RECIPIENT}</a></p>`,
    ),
    text: `${copy.greeting}, ${submission.customer_name}.\n\n${copy.thankYou}\n${copy.attachment}\n\nNuveli Studio\n${INTERNAL_RECIPIENT}`,
    attachments: [{ filename, content: pdfBase64 }],
    tags: submissionTags(submission.id, "customer", submission.locale),
  };
}

function buildInternalEmail(
  submission: SubmissionRow,
  filename: string,
  pdfBase64: string,
): ResendPayload {
  const safeName = escapeHtml(submission.customer_name);
  const safeEmail = escapeHtml(submission.customer_email);
  const safePhone = escapeHtml(submission.customer_phone || "Ni naveden");
  const summary = escapeHtml(submission.summary);
  const answers = escapeHtml(JSON.stringify(submission.answers, null, 2));

  return {
    from: CUSTOMER_FROM,
    to: [INTERNAL_RECIPIENT],
    reply_to: submission.customer_email,
    subject: `Nov Home DNA™ [${submission.locale.toUpperCase()}] – ${sanitizeSubject(submission.customer_name)}`,
    html: emailLayout(
      "sl",
      `<h1 style="font-size:28px;line-height:1.2;margin:0 0 22px;color:#1a1a18">Nov Home DNA™</h1>
       <table role="presentation" style="border-collapse:collapse;width:100%;margin-bottom:26px">
         <tr><td style="padding:7px 12px 7px 0;color:#6c6862;width:120px">Jezik</td><td style="padding:7px 0">${submission.locale.toUpperCase()}</td></tr>
         <tr><td style="padding:7px 12px 7px 0;color:#6c6862">Ime</td><td style="padding:7px 0">${safeName}</td></tr>
         <tr><td style="padding:7px 12px 7px 0;color:#6c6862">E-pošta</td><td style="padding:7px 0"><a href="mailto:${safeEmail}" style="color:#76624b">${safeEmail}</a></td></tr>
         <tr><td style="padding:7px 12px 7px 0;color:#6c6862">Telefon</td><td style="padding:7px 0">${safePhone}</td></tr>
       </table>
       <h2 style="font-size:18px;margin:0 0 10px;color:#1a1a18">Povzetek projekta</h2>
       <pre style="white-space:pre-wrap;overflow-wrap:anywhere;background:#f3f0ea;padding:18px;border-radius:8px;font:14px/1.55 Arial,sans-serif;margin:0 0 26px">${summary}</pre>
       <h2 style="font-size:18px;margin:0 0 10px;color:#1a1a18">Vsi odgovori</h2>
       <pre style="white-space:pre-wrap;overflow-wrap:anywhere;background:#f3f0ea;padding:18px;border-radius:8px;font:13px/1.5 monospace;margin:0">${answers}</pre>`,
    ),
    text: `NOV HOME DNA™\n\nJezik: ${submission.locale.toUpperCase()}\nIme: ${submission.customer_name}\nE-pošta: ${submission.customer_email}\nTelefon: ${submission.customer_phone || "Ni naveden"}\n\nPOVZETEK PROJEKTA\n${submission.summary}\n\nVSI ODGOVORI\n${JSON.stringify(submission.answers, null, 2)}`,
    attachments: [{ filename, content: pdfBase64 }],
    tags: submissionTags(submission.id, "internal", submission.locale),
  };
}

async function sendResendEmail(
  apiKey: string,
  payload: ResendPayload,
  idempotencyKey: string,
): Promise<string> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(payload),
  });
  const body = (await response.json().catch(() => null)) as {
    id?: string;
    message?: string;
    name?: string;
  } | null;
  if (!response.ok || !body?.id) {
    const detail = body?.message || body?.name || `HTTP ${response.status}`;
    throw new Error(`Resend ${detail}`.slice(0, 500));
  }
  return body.id;
}

function resultFor(submission: SubmissionRow): HomeDnaSubmissionResult {
  return {
    submissionId: submission.id,
    delivered:
      submission.customer_email_status === "sent" && submission.internal_email_status === "sent",
    customerEmailStatus: submission.customer_email_status,
    internalEmailStatus: submission.internal_email_status,
  };
}

function emailLayout(locale: Locale, content: string): string {
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"></head><body style="margin:0;background:#f6f4ef;color:#2d2b28;font-family:Arial,sans-serif"><div style="max-width:640px;margin:0 auto;padding:34px 20px"><div style="background:#fff;padding:34px;border-radius:12px;line-height:1.6">${content}</div></div></body></html>`;
}

function submissionTags(id: string, recipient: "customer" | "internal", locale: Locale) {
  return [
    { name: "type", value: "home-dna" },
    { name: "recipient", value: recipient },
    { name: "locale", value: locale },
    { name: "submission_id", value: id },
  ];
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character] ?? character;
  });
}

function sanitizeSubject(value: string): string {
  return value
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
}

function estimateBase64Bytes(value: string): number {
  const padding = value.endsWith("==") ? 2 : value.endsWith("=") ? 1 : 0;
  return Math.floor((value.length * 3) / 4) - padding;
}

function hashIp(ip: string): string {
  const secret =
    process.env["HOME_DNA_RATE_LIMIT_SALT"] ||
    process.env["SUPABASE_SERVICE_ROLE_KEY"] ||
    "nuveli-home-dna";
  return createHmac("sha256", secret).update(ip).digest("hex");
}

function safeErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message.slice(0, 500) : "Unknown email error";
}
