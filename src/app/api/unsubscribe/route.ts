import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import {
  normalizeAndValidateEmail,
  normalizeAndValidateWallet,
  parseUuidQueryParam,
  readJsonBodySafe,
} from '@/lib/input-guards';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

type UnsubscribeNewsletterResult =
  | { ok: true; already: boolean }
  | { ok: false };

async function unsubscribeNewsletterForEmail(
  normalizedEmail: string
): Promise<UnsubscribeNewsletterResult> {
  const { data: existingNewsletter } = await supabase
    .from('newsletter')
    .select('email, status, unsubscribed_at')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (
    existingNewsletter?.status === 'unsubscribed' &&
    existingNewsletter.unsubscribed_at
  ) {
    return { ok: true, already: true };
  }

  const { error: upsertError } = await supabase.from('newsletter').upsert(
    {
      email: normalizedEmail,
      status: 'unsubscribed',
      source: 'waitlist',
      unsubscribed_at: new Date().toISOString(),
    },
    {
      onConflict: 'email',
      ignoreDuplicates: false,
    }
  );

  if (upsertError) {
    console.error('Unsubscribe: newsletter upsert failed:', upsertError);
    return { ok: false };
  }

  return { ok: true, already: false };
}

function getRedirectBase(request: NextRequest): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL === '1') {
    return 'https://waitlist.hyperkitlabs.com';
  }
  return request.nextUrl.origin;
}

/**
 * One-click unsubscribe from marketing emails (GET link in transactional mail).
 * Validates the same token + id as email confirmation, then sets newsletter status.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = parseUuidQueryParam(searchParams.get('token'));
  const id = parseUuidQueryParam(searchParams.get('id'));

  const baseUrl = getRedirectBase(request);

  if (!token || !id) {
    return NextResponse.redirect(
      new URL('/unsubscribe?error=missing_params', baseUrl)
    );
  }

  try {
    const { data: entryData, error: fetchError } = await supabase
      .from('waitlist_entries')
      .select('id, email, confirmation_token')
      .eq('id', id)
      .single();

    if (fetchError || !entryData) {
      console.error('Unsubscribe: entry not found:', {
        idPrefix: id.slice(0, 8),
        error: fetchError,
      });
      return NextResponse.redirect(
        new URL('/unsubscribe?error=invalid_token', baseUrl)
      );
    }

    const normalizedToken = token;
    const normalizedDbToken = String(entryData.confirmation_token || '')
      .toLowerCase()
      .trim();

    if (normalizedToken !== normalizedDbToken) {
      console.error('Unsubscribe: token mismatch', { idPrefix: id.slice(0, 8) });
      return NextResponse.redirect(
        new URL('/unsubscribe?error=invalid_token', baseUrl)
      );
    }

    const normalizedEmail = entryData.email.toLowerCase().trim();

    const result = await unsubscribeNewsletterForEmail(normalizedEmail);
    if (!result.ok) {
      return NextResponse.redirect(
        new URL('/unsubscribe?error=server_error', baseUrl)
      );
    }
    if (result.already) {
      return NextResponse.redirect(
        new URL('/unsubscribe?success=true&already_unsubscribed=true', baseUrl)
      );
    }

    return NextResponse.redirect(new URL('/unsubscribe?success=true', baseUrl));
  } catch (error) {
    console.error('Unsubscribe: unexpected error:', error);
    return NextResponse.redirect(
      new URL('/unsubscribe?error=server_error', baseUrl)
    );
  }
}

/**
 * Unsubscribe using the same email + wallet as waitlist signup (for users without the email link).
 */
export async function POST(request: NextRequest) {
  try {
    const parsed = await readJsonBodySafe(request);
    if (!parsed.ok) {
      return NextResponse.json(
        { error: parsed.error },
        { status: parsed.status }
      );
    }

    const emailRaw = parsed.data.email;
    const walletRaw = parsed.data.walletAddress;

    if (emailRaw === undefined || walletRaw === undefined) {
      return NextResponse.json(
        { error: 'Email and wallet address are required' },
        { status: 400 }
      );
    }

    const emailResult = normalizeAndValidateEmail(emailRaw);
    if (!emailResult.ok) {
      return NextResponse.json({ error: emailResult.error }, { status: 400 });
    }

    const walletResult = normalizeAndValidateWallet(walletRaw);
    if (!walletResult.ok) {
      return NextResponse.json({ error: walletResult.error }, { status: 400 });
    }

    const normalizedEmail = emailResult.value;
    const normalizedWallet = walletResult.value;

    const { data: entryData, error: entryError } = await supabase
      .from('waitlist_entries')
      .select('id, email')
      .eq('email', normalizedEmail)
      .eq('wallet_address', normalizedWallet)
      .maybeSingle();

    if (entryError || !entryData) {
      return NextResponse.json(
        {
          error:
            'No waitlist entry found for this email and wallet. Check that they match what you used to sign up.',
        },
        { status: 404 }
      );
    }

    const result = await unsubscribeNewsletterForEmail(normalizedEmail);
    if (!result.ok) {
      return NextResponse.json(
        { error: 'Could not update preferences. Please try again.' },
        { status: 500 }
      );
    }

    if (result.already) {
      return NextResponse.json({
        success: true,
        alreadyUnsubscribed: true,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unsubscribe POST:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
