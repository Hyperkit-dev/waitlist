import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get app URL with smart fallback
function getAppUrl(): string {
  // Priority 1: Use explicit environment variable
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  // Priority 2: Detect production environment
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL === '1') {
    return 'https://waitlist.hyperkitlabs.com';
  }
  // Priority 3: Default to localhost for development
  return 'http://localhost:3000';
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');
  const id = searchParams.get('id');

  if (!token || !id) {
    // Get base URL for proper redirect
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    return NextResponse.redirect(
      new URL('/confirmed?error=missing_params', baseUrl)
    );
  }

  try {
    // First, check if the entry exists and get the token
    const { data: entryData, error: fetchError } = await supabase
      .from('waitlist_entries')
      .select('id, confirmation_token, email_confirmed')
      .eq('id', id)
      .single();

    if (fetchError || !entryData) {
      console.error('Entry not found:', { id, error: fetchError });
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
      return NextResponse.redirect(
        new URL('/confirmed?error=invalid_token', baseUrl)
      );
    }

    // Check if already confirmed
    if (entryData.email_confirmed) {
      console.log('Email already confirmed:', id);
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
      return NextResponse.redirect(
        new URL('/confirmed?success=true&already_confirmed=true', baseUrl)
      );
    }

    // Normalize tokens for comparison (UUIDs should be compared as strings, case-insensitive)
    const normalizedToken = token.toLowerCase().trim();
    const normalizedDbToken = String(entryData.confirmation_token || '').toLowerCase().trim();

    // Verify token matches
    if (normalizedToken !== normalizedDbToken) {
      console.error('Token mismatch:', {
        provided: token,
        providedNormalized: normalizedToken,
        expected: entryData.confirmation_token,
        expectedNormalized: normalizedDbToken,
        id
      });
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
      return NextResponse.redirect(
        new URL('/confirmed?error=invalid_token', baseUrl)
      );
    }

    // Use the database token for the update (more reliable than URL token)
    // Verify token and confirm email
    const { data, error } = await supabase
      .from('waitlist_entries')
      .update({
        email_confirmed: true,
        confirmed_at: new Date().toISOString(),
        status: 'confirmed',
      })
      .eq('id', id)
      .eq('confirmation_token', entryData.confirmation_token) // Use DB token, not URL token
      .select()
      .single();

    if (error || !data) {
      console.error('Confirmation update error:', { 
        error, 
        id, 
        tokenFromUrl: token,
        tokenFromDb: entryData.confirmation_token,
        tokensMatch: normalizedToken === normalizedDbToken
      });
      // Get base URL for proper redirect
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
      return NextResponse.redirect(
        new URL('/confirmed?error=invalid_token', baseUrl)
      );
    }

    // Ensure email is in newsletter with active status (non-blocking)
    try {
      const { error: newsletterError } = await supabase
        .from('newsletter')
        .upsert({
          email: data.email.toLowerCase().trim(),
          status: 'active',
          source: 'waitlist',
          unsubscribed_at: null, // Clear unsubscribed_at if they were previously unsubscribed
        }, {
          onConflict: 'email',
          ignoreDuplicates: false // Update existing records
        });

      if (newsletterError) {
        console.error('Failed to update newsletter (non-critical):', newsletterError);
      } else {
        console.log('Newsletter subscription confirmed for:', data.email);
      }
    } catch (newsletterErr) {
      console.error('Error updating newsletter (non-critical):', newsletterErr);
      // Don't throw - confirmation was successful
    }

    // Get base URL for proper redirect
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    // Redirect to success page
    return NextResponse.redirect(
      new URL('/confirmed?success=true', baseUrl)
    );
  } catch (error) {
    console.error('Unexpected confirmation error:', error);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    return NextResponse.redirect(
      new URL('/confirmed?error=server_error', baseUrl)
    );
  }
}

