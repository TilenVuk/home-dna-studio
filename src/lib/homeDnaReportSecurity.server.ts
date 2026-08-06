import { supabaseAdmin } from "@/integrations/supabase/client.server";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_ACTION = "home_dna_report";
const TURNSTILE_TIMEOUT_MS = 10_000;
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60;
const DEFAULT_RATE_LIMIT = 5;

type TurnstileResult = {
  success?: boolean;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
};

export async function authorizeHomeDnaReport(input: {
  turnstileToken: string;
  requestIp: string;
}): Promise<void> {
  await verifyTurnstile(input.turnstileToken, input.requestIp);
  await enforceReportRateLimit(input.requestIp);
}

async function verifyTurnstile(token: string, requestIp: string): Promise<void> {
  const secret = process.env["TURNSTILE_SECRET_KEY"]?.trim();
  if (!secret) throw new Error("HOME_DNA_BOT_PROTECTION_UNAVAILABLE");

  const body = new FormData();
  body.set("secret", secret);
  body.set("response", token);
  body.set("idempotency_key", crypto.randomUUID());
  if (requestIp && requestIp !== "unknown") body.set("remoteip", requestIp);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TURNSTILE_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body,
      signal: controller.signal,
    });
  } catch {
    throw new Error("HOME_DNA_BOT_PROTECTION_UNAVAILABLE");
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) throw new Error("HOME_DNA_BOT_PROTECTION_UNAVAILABLE");

  let result: TurnstileResult;
  try {
    result = (await response.json()) as TurnstileResult;
  } catch {
    throw new Error("HOME_DNA_BOT_PROTECTION_UNAVAILABLE");
  }
  if (!result.success) throw new Error("HOME_DNA_BOT_CHECK_FAILED");

  const isTestSecret = secret === "1x0000000000000000000000000000000AA";
  const validAction =
    result.action === TURNSTILE_ACTION || (isTestSecret && result.action === "test");
  if (!validAction) throw new Error("HOME_DNA_BOT_CHECK_FAILED");

  const expectedHostname = process.env["TURNSTILE_EXPECTED_HOSTNAME"]?.trim().toLowerCase();
  if (expectedHostname && result.hostname?.toLowerCase() !== expectedHostname) {
    throw new Error("HOME_DNA_BOT_CHECK_FAILED");
  }
}

async function enforceReportRateLimit(requestIp: string): Promise<void> {
  const requestIpHash = await hashRateLimitKey(requestIp);
  const maxRequests = boundedInteger(
    process.env["HOME_DNA_REPORT_RATE_LIMIT_PER_HOUR"],
    DEFAULT_RATE_LIMIT,
    1,
    20,
  );

  const { data, error } = await supabaseAdmin.rpc("consume_home_dna_report_quota", {
    p_request_ip_hash: requestIpHash,
    p_window_seconds: RATE_LIMIT_WINDOW_SECONDS,
    p_max_requests: maxRequests,
  });

  if (error) {
    console.error("Home DNA report rate-limit check failed", { code: error.code });
    throw new Error("HOME_DNA_STORAGE_UNAVAILABLE");
  }

  if (!data) throw new Error("HOME_DNA_RATE_LIMITED");
}

async function hashRateLimitKey(requestIp: string): Promise<string> {
  const salt =
    process.env["HOME_DNA_RATE_LIMIT_SALT"]?.trim() ||
    process.env["SUPABASE_SERVICE_ROLE_KEY"]?.trim();
  if (!salt) throw new Error("HOME_DNA_STORAGE_UNAVAILABLE");

  const bytes = new TextEncoder().encode(`${salt}:${requestIp || "unknown"}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, "0")).join("");
}

function boundedInteger(
  value: string | undefined,
  fallback: number,
  minimum: number,
  maximum: number,
) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? Math.min(maximum, Math.max(minimum, parsed)) : fallback;
}
