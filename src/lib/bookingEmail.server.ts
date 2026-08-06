const BOOKING_FROM = "Nuveli Studio <termini@obvestila.nuvelistudio.com>";
const INTERNAL_RECIPIENT = "info@nuvelistudio.com";

export type BookingEmailStatus = "pending" | "sent" | "failed";

export type BookingEmailContext = {
  bookingId: string;
  slotStart: string;
  slotEnd: string;
  consultationType: string;
  source: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  projectType: string;
  message: string;
};

export type BookingEmailOutcome = {
  customerStatus: BookingEmailStatus;
  internalStatus: BookingEmailStatus;
  customerResendId: string | null;
  internalResendId: string | null;
  error: string | null;
};

type ResendPayload = {
  from: string;
  to: string[];
  reply_to: string;
  subject: string;
  html: string;
  text: string;
  tags: Array<{ name: string; value: string }>;
};

const dateTimeFormatter = new Intl.DateTimeFormat("sl-SI", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "Europe/Ljubljana",
});

const timeFormatter = new Intl.DateTimeFormat("sl-SI", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "Europe/Ljubljana",
});

export async function sendBookingEmails(
  context: BookingEmailContext,
): Promise<BookingEmailOutcome> {
  const apiKey = process.env["RESEND_API_KEY"];

  if (!apiKey) {
    console.error("Booking email: RESEND_API_KEY is not configured");
    return {
      customerStatus: "failed",
      internalStatus: "failed",
      customerResendId: null,
      internalResendId: null,
      error: "RESEND_API_KEY is not configured",
    };
  }

  const errors: string[] = [];
  let customerStatus: BookingEmailStatus = "failed";
  let internalStatus: BookingEmailStatus = "failed";
  let customerResendId: string | null = null;
  let internalResendId: string | null = null;

  try {
    customerResendId = await sendResendEmail(
      apiKey,
      buildCustomerEmail(context),
      `booking-${context.bookingId}-customer`,
    );
    customerStatus = "sent";
  } catch (error) {
    errors.push(`customer: ${safeErrorMessage(error)}`);
  }

  try {
    internalResendId = await sendResendEmail(
      apiKey,
      buildInternalEmail(context),
      `booking-${context.bookingId}-internal`,
    );
    internalStatus = "sent";
  } catch (error) {
    errors.push(`internal: ${safeErrorMessage(error)}`);
  }

  if (errors.length) console.error("Booking email delivery issue", errors.join(" | "));

  return {
    customerStatus,
    internalStatus,
    customerResendId,
    internalResendId,
    error: errors.length ? errors.join(" | ").slice(0, 2_000) : null,
  };
}

function consultationLabel(type: string): string {
  return type === "home-visit" ? "Obisk na domu" : "Spletni posvet";
}

function consultationNote(type: string): string {
  return type === "home-visit"
    ? "Naslov in podrobnosti obiska uskladimo pred srečanjem."
    : "Povezavo do spletnega srečanja vam posredujemo pred terminom.";
}

function buildCustomerEmail(context: BookingEmailContext): ResendPayload {
  const name = escapeHtml(context.customerName);
  const when = dateTimeFormatter.format(new Date(context.slotStart));
  const until = timeFormatter.format(new Date(context.slotEnd));
  const type = consultationLabel(context.consultationType);
  const note = consultationNote(context.consultationType);

  return {
    from: BOOKING_FROM,
    to: [context.customerEmail],
    reply_to: INTERNAL_RECIPIENT,
    subject: "Potrditev termina – Nuveli Studio",
    html: emailLayout(`
      <p style="margin:0 0 18px">Pozdravljeni, ${name}.</p>
      <h1 style="font-size:28px;line-height:1.2;margin:0 0 18px;color:#1a1a18">Vaš termin je potrjen</h1>
      <table role="presentation" style="border-collapse:collapse;width:100%;margin-bottom:24px">
        <tr><td style="padding:7px 12px 7px 0;color:#6c6862;width:130px">Datum in ura</td><td style="padding:7px 0">${escapeHtml(when)} – ${escapeHtml(until)}</td></tr>
        <tr><td style="padding:7px 12px 7px 0;color:#6c6862">Način srečanja</td><td style="padding:7px 0">${escapeHtml(type)}</td></tr>
      </table>
      <p style="margin:0 0 16px">${escapeHtml(note)}</p>
      <p style="margin:0 0 16px">Če termin ne ustreza več, nam preprosto odgovorite na to sporočilo.</p>
      <p style="margin:28px 0 0">Nuveli Studio<br><a href="mailto:${INTERNAL_RECIPIENT}" style="color:#76624b">${INTERNAL_RECIPIENT}</a></p>
    `),
    text: `Pozdravljeni, ${context.customerName}.\n\nVaš termin je potrjen.\n\nDatum in ura: ${when} – ${until} (Europe/Ljubljana)\nNačin srečanja: ${type}\n\n${note}\n\nČe termin ne ustreza več, nam odgovorite na to sporočilo.\n\nNuveli Studio\n${INTERNAL_RECIPIENT}`,
    tags: bookingTags(context.bookingId, "customer"),
  };
}

function buildInternalEmail(context: BookingEmailContext): ResendPayload {
  const when = dateTimeFormatter.format(new Date(context.slotStart));
  const until = timeFormatter.format(new Date(context.slotEnd));
  const type = consultationLabel(context.consultationType);
  const phone = context.customerPhone || "Ni naveden";
  const projectType = context.projectType || "Ni naveden";
  const message = context.message || "Ni sporočila";

  return {
    from: BOOKING_FROM,
    to: [INTERNAL_RECIPIENT],
    reply_to: context.customerEmail,
    subject: `Nov rezerviran termin – ${sanitizeSubject(context.customerName)}`,
    html: emailLayout(`
      <h1 style="font-size:28px;line-height:1.2;margin:0 0 22px;color:#1a1a18">Nov rezerviran termin</h1>
      <table role="presentation" style="border-collapse:collapse;width:100%;margin-bottom:26px">
        <tr><td style="padding:7px 12px 7px 0;color:#6c6862;width:140px">Ime</td><td style="padding:7px 0">${escapeHtml(context.customerName)}</td></tr>
        <tr><td style="padding:7px 12px 7px 0;color:#6c6862">E-pošta</td><td style="padding:7px 0"><a href="mailto:${escapeHtml(context.customerEmail)}" style="color:#76624b">${escapeHtml(context.customerEmail)}</a></td></tr>
        <tr><td style="padding:7px 12px 7px 0;color:#6c6862">Telefon</td><td style="padding:7px 0">${escapeHtml(phone)}</td></tr>
        <tr><td style="padding:7px 12px 7px 0;color:#6c6862">Tip projekta</td><td style="padding:7px 0">${escapeHtml(projectType)}</td></tr>
        <tr><td style="padding:7px 12px 7px 0;color:#6c6862">Datum in ura</td><td style="padding:7px 0">${escapeHtml(when)} – ${escapeHtml(until)}</td></tr>
        <tr><td style="padding:7px 12px 7px 0;color:#6c6862">Način srečanja</td><td style="padding:7px 0">${escapeHtml(type)}</td></tr>
        <tr><td style="padding:7px 12px 7px 0;color:#6c6862">Vir</td><td style="padding:7px 0">${escapeHtml(context.source)}</td></tr>
        <tr><td style="padding:7px 12px 7px 0;color:#6c6862">ID rezervacije</td><td style="padding:7px 0">${escapeHtml(context.bookingId)}</td></tr>
        <tr><td style="padding:7px 12px 7px 0;color:#6c6862">Začetek (UTC)</td><td style="padding:7px 0">${escapeHtml(context.slotStart)}</td></tr>
        <tr><td style="padding:7px 12px 7px 0;color:#6c6862">Konec (UTC)</td><td style="padding:7px 0">${escapeHtml(context.slotEnd)}</td></tr>
      </table>
      <h2 style="font-size:18px;margin:0 0 10px;color:#1a1a18">Sporočilo</h2>
      <pre style="white-space:pre-wrap;overflow-wrap:anywhere;background:#f3f0ea;padding:18px;border-radius:8px;font:14px/1.55 Arial,sans-serif;margin:0">${escapeHtml(message)}</pre>
    `),
    text: `NOV REZERVIRAN TERMIN\n\nIme: ${context.customerName}\nE-pošta: ${context.customerEmail}\nTelefon: ${phone}\nTip projekta: ${projectType}\nDatum in ura: ${when} – ${until} (Europe/Ljubljana)\nNačin srečanja: ${type}\nVir: ${context.source}\nID rezervacije: ${context.bookingId}\nZačetek (UTC): ${context.slotStart}\nKonec (UTC): ${context.slotEnd}\n\nSPOROČILO\n${message}`,
    tags: bookingTags(context.bookingId, "internal"),
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

function emailLayout(content: string): string {
  return `<!doctype html><html lang="sl"><head><meta charset="utf-8"></head><body style="margin:0;background:#f6f4ef;color:#2d2b28;font-family:Arial,sans-serif"><div style="max-width:640px;margin:0 auto;padding:34px 20px"><div style="background:#fff;padding:34px;border-radius:12px;line-height:1.6">${content}</div></div></body></html>`;
}

function bookingTags(id: string, recipient: "customer" | "internal") {
  return [
    { name: "type", value: "consultation-booking" },
    { name: "recipient", value: recipient },
    { name: "booking_id", value: id },
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

function safeErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message.replace(/re_[A-Za-z0-9_-]+/g, "[redacted]").slice(0, 300);
}
