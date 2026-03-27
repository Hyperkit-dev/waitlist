/**
 * Server-side input hardening for public API routes.
 * Reduces XSS (HTML email), injection, oversized payloads, and prototype pollution.
 */

/** RFC 5321 total length limit */
export const MAX_EMAIL_LENGTH = 254;

/** Reject bodies larger than this (DoS / log flooding). */
export const MAX_JSON_BODY_BYTES = 12_000;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Practical safe subset: no spaces, angle brackets, or control chars in local part.
 * NFKC-normalized before matching.
 */
const EMAIL_REGEX_STRICT =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

const WALLET_REGEX = /^0x[0-9a-fA-F]{40}$/;

const UNSAFE_JSON_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

export function hasDisallowedControlChars(s: string): boolean {
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c < 32 || c === 127) return true;
  }
  return false;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  if (v === null || typeof v !== 'object' || Array.isArray(v)) return false;
  return Object.getPrototypeOf(v) === Object.prototype;
}

function hasPrototypePollutionKeys(obj: Record<string, unknown>): boolean {
  for (const k of Object.keys(obj)) {
    if (UNSAFE_JSON_KEYS.has(k)) return true;
  }
  return false;
}

export type SafeJsonOk = { ok: true; data: Record<string, unknown> };
export type SafeJsonErr = { ok: false; error: string; status: number };

/**
 * Parse JSON body with size cap and prototype-pollution guard.
 */
export async function readJsonBodySafe(
  request: Request
): Promise<SafeJsonOk | SafeJsonErr> {
  const contentLength = request.headers.get('content-length');
  if (contentLength) {
    const n = parseInt(contentLength, 10);
    if (!Number.isFinite(n) || n > MAX_JSON_BODY_BYTES) {
      return { ok: false, error: 'Request too large', status: 413 };
    }
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return { ok: false, error: 'Invalid request body', status: 400 };
  }

  if (raw.length > MAX_JSON_BODY_BYTES) {
    return { ok: false, error: 'Request too large', status: 413 };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, error: 'Invalid JSON', status: 400 };
  }

  if (!isPlainObject(parsed)) {
    return { ok: false, error: 'Invalid request body', status: 400 };
  }

  if (hasPrototypePollutionKeys(parsed)) {
    return { ok: false, error: 'Invalid request body', status: 400 };
  }

  return { ok: true, data: parsed };
}

export type ValidatedEmail =
  | { ok: true; value: string }
  | { ok: false; error: string };

/**
 * Normalize (NFKC), length-bound, and validate email for storage and comparison.
 */
export function normalizeAndValidateEmail(input: unknown): ValidatedEmail {
  if (typeof input !== 'string') {
    return { ok: false, error: 'Invalid email format' };
  }

  let s = input.trim();
  if (s.length === 0) {
    return { ok: false, error: 'Invalid email format' };
  }

  try {
    s = s.normalize('NFKC');
  } catch {
    return { ok: false, error: 'Invalid email format' };
  }

  if (s.length > MAX_EMAIL_LENGTH) {
    return { ok: false, error: 'Invalid email format' };
  }

  if (hasDisallowedControlChars(s)) {
    return { ok: false, error: 'Invalid email format' };
  }

  const lower = s.toLowerCase();

  if (!EMAIL_REGEX_STRICT.test(lower)) {
    return { ok: false, error: 'Invalid email format' };
  }

  return { ok: true, value: lower };
}

export type ValidatedWallet =
  | { ok: true; value: string }
  | { ok: false; error: string };

export function normalizeAndValidateWallet(input: unknown): ValidatedWallet {
  if (typeof input !== 'string') {
    return { ok: false, error: 'Invalid wallet address format' };
  }

  const s = input.trim();
  if (s.length !== 42) {
    return { ok: false, error: 'Invalid wallet address format' };
  }

  if (hasDisallowedControlChars(s)) {
    return { ok: false, error: 'Invalid wallet address format' };
  }

  if (!WALLET_REGEX.test(s)) {
    return { ok: false, error: 'Invalid wallet address format' };
  }

  return { ok: true, value: s.toLowerCase() };
}

/**
 * Strict UUID (36 chars) for query params — rejects crafted strings before DB lookup.
 */
export function parseUuidQueryParam(value: string | null): string | null {
  if (value == null || typeof value !== 'string') return null;
  const s = value.trim();
  if (s.length !== 36) return null;
  if (!UUID_REGEX.test(s)) return null;
  return s.toLowerCase();
}

/** Escape text embedded in HTML email templates (mitigates XSS in clients that render HTML). */
export function htmlEscape(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Single-line plain-text email fields — strips CR/LF to reduce header/body smuggling in text parts. */
export function sanitizePlainTextEmailField(text: string, maxLen: number): string {
  return text.replace(/[\r\n\x00]/g, ' ').slice(0, maxLen);
}
