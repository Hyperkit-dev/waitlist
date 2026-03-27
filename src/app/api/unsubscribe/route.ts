import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  const token = searchParams.get('token');
  const id = searchParams.get('id');

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
      console.error('Unsubscribe: entry not found:', { id, error: fetchError });
      return NextResponse.redirect(
        new URL('/unsubscribe?error=invalid_token', baseUrl)
      );
    }

    const normalizedToken = token.toLowerCase().trim();
    const normalizedDbToken = String(entryData.confirmation_token || '')
      .toLowerCase()
      .trim();

    if (normalizedToken !== normalizedDbToken) {
      console.error('Unsubscribe: token mismatch', { id });
      return NextResponse.redirect(
        new URL('/unsubscribe?error=invalid_token', baseUrl)
      );
    }

    const normalizedEmail = entryData.email.toLowerCase().trim();

    const { data: existingNewsletter } = await supabase
      .from('newsletter')
      .select('email, status, unsubscribed_at')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (
      existingNewsletter?.status === 'unsubscribed' &&
      existingNewsletter.unsubscribed_at
    ) {
      return NextResponse.redirect(
        new URL('/unsubscribe?success=true&already_unsubscribed=true', baseUrl)
      );
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
      return NextResponse.redirect(
        new URL('/unsubscribe?error=server_error', baseUrl)
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
