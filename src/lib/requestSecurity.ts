export function isAllowedRequestOrigin(request: Request, origin: string): boolean {
  let originUrl: URL;
  try {
    originUrl = new URL(origin);
  } catch {
    return false;
  }

  const candidates = new Set<string>();
  const directHost = request.headers.get("host");
  if (directHost) candidates.add(directHost.trim());

  const forwardedHosts = request.headers.get("x-forwarded-host");
  for (const host of forwardedHosts?.split(",") ?? []) {
    if (host.trim()) candidates.add(host.trim());
  }

  try {
    candidates.add(new URL(request.url).host);
  } catch {
    // A malformed request URL must not weaken the Origin check.
  }

  const normalizedOriginHost = normalizeHost(originUrl.host, originUrl.protocol);
  if (!normalizedOriginHost) return false;

  for (const candidate of candidates) {
    if (normalizeHost(candidate, originUrl.protocol) === normalizedOriginHost) return true;
  }

  if (!isLoopbackHostname(originUrl.hostname)) return false;

  return [...candidates].some((candidate) => {
    const hostname = hostnameFromHost(candidate, originUrl.protocol);
    return hostname ? isLoopbackHostname(hostname) : false;
  });
}

function normalizeHost(host: string, protocol: string): string | null {
  try {
    return new URL(`${protocol}//${host}`).host.toLowerCase();
  } catch {
    return null;
  }
}

function hostnameFromHost(host: string, protocol: string): string | null {
  try {
    return new URL(`${protocol}//${host}`).hostname;
  } catch {
    return null;
  }
}

function isLoopbackHostname(hostname: string): boolean {
  const normalized = hostname
    .toLowerCase()
    .replace(/^\[|\]$/g, "")
    .replace(/\.$/, "");
  return (
    normalized === "localhost" ||
    normalized.endsWith(".localhost") ||
    normalized === "127.0.0.1" ||
    normalized === "0.0.0.0" ||
    normalized === "::1"
  );
}
