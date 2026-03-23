import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const resendApiKey = process.env.RESEND_API_KEY;

// Use anon key (works with RLS policies)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize Resend if API key is provided
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Helper function to get app URL with smart fallback
function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  // Fallback based on environment
  return process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
    ? 'https://waitlist.hyperkitlabs.com'
    : 'http://localhost:3000';
}

// Email template functions - defined before POST handler to avoid reference errors
function generateConfirmationEmail(
  email: string,
  walletAddress: string,
  confirmationUrl: string,
  entryId: string
): string {
  const shortWallet = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  
  // GitHub raw URLs for assets (better email client compatibility)
  const assetBase = 'https://waitlist.hyperkitlabs.com';
  
  // Logo URL - Served from app for reliable email delivery
  const logoUrl = `${assetBase}/logo/brand/hyperkit/Hyperkit-logo.png`;
  
  // Icon URLs for registration details
  const iconUrls = {
    email: `${assetBase}/icon/email-icon.png`,
    wallet: `${assetBase}/icon/wallet-icon.png`,
  };
  
  // Social media icon URLs (hosted PNG with transparent background)
  const socialIcons = {
    x: `${assetBase}/social/x-icon.png`,
    discord: `${assetBase}/social/discord-icon.png`,
    telegram: `${assetBase}/social/telegram-icon.png`,
  };
  
  // Social media links
  const socialLinks = {
    x: 'https://x.com/SKALEnetwork',
    discord: 'https://discord.gg/skale',
    telegram: 'https://t.me/skaleofficial',
  };
  
  // Website URL
  const websiteUrl = 'https://hyperkitlabs.com';
  
  // Add tracking parameters to confirmation link
  const trackedConfirmationUrl = `${confirmationUrl}&utm_source=email&utm_medium=confirmation&utm_campaign=waitlist&entry_id=${entryId}`;
  
  return `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="dark only">
    <title>Waitlist Confirmation</title>
    <!--[if mso]>
    <style type="text/css">
        body, table, td {font-family: Arial, sans-serif !important;}
    </style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #050508; font-family: Arial, Helvetica, sans-serif;">
    <!-- Outer wrapper -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #050508; margin: 0; padding: 0;">
        <tr>
            <td align="center" style="padding: 40px 16px;">
                <!-- Main Container Card -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="560" style="max-width: 560px; width: 100%; background-color: #0A0A0F; border: 1px solid #1a1a1f; border-radius: 12px;">
                    
                    <!-- Header / Logo -->
                    <tr>
                        <td align="center" style="padding: 40px 32px 24px 32px;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                                <tr>
                                    <td align="center">
                                        <!-- Logo Image (hosted PNG) -->
                                        <img src="${logoUrl}" alt="HYPERKIT" width="140" height="40" style="display: block; border: 0; outline: none; text-decoration: none; max-width: 140px; height: auto;">
                                        <!-- Fallback text for email clients that block images -->
                                        <!--[if !mso]><!-->
                                        <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
                                            <span style="font-size: 24px; font-weight: 600; letter-spacing: 0.1em; color: #ffffff; text-transform: uppercase;">HYPERKIT</span>
                                        </div>
                                        <!--<![endif]-->
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td align="center" style="padding: 0 32px 32px 32px;">
                            <!-- Success Icon -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 24px auto;">
                                <tr>
                                    <td align="center" valign="middle" style="width: 64px; height: 64px; background-color: #6366f1; border-radius: 50%;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" height="100%">
                                            <tr>
                                                <td align="center" valign="middle" style="color: #ffffff; font-size: 32px; line-height: 1;">✓</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Heading -->
                            <h1 style="font-size: 30px; font-weight: 600; letter-spacing: -0.025em; color: #ffffff; margin: 0 0 16px 0; padding: 0; font-family: Arial, Helvetica, sans-serif; line-height: 1.2;">
                                Confirm your spot
                            </h1>
                            
                            <!-- Description -->
                            <p style="font-size: 16px; color: #94a3b8; line-height: 1.625; font-weight: 400; margin: 0 0 8px 0; padding: 0; font-family: Arial, Helvetica, sans-serif;">
                                You've signed up for the Hyperkit waitlist! To secure your spot, please confirm your email address by clicking the button below.
                            </p>
                            <p style="font-size: 14px; color: #64748b; line-height: 1.5; font-weight: 400; margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif;">
                                Your spot will be reserved once you confirm your email.
                            </p>
                        </td>
                    </tr>

                    <!-- Registration Details Card -->
                    <tr>
                        <td align="center" style="padding: 0 32px 32px 32px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        
                                        <!-- Card Header -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 8px;">
                                            <tr>
                                                <td>
                                                    <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; font-weight: 600; margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif;">
                                                        Registration Details
                                                    </p>
                                                </td>
                                                <td align="right" width="20">
                                                    <!-- Status dots -->
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td width="4" height="4" style="background-color: #6366f1; border-radius: 50%; padding-right: 4px;"></td>
                                                            <td width="4" height="4" style="background-color: #475569; border-radius: 50%; padding-right: 4px;"></td>
                                                            <td width="4" height="4" style="background-color: #475569; border-radius: 50%;"></td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>

                                        <!-- Email Address Row -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 12px;">
                                            <tr>
                                                <td width="32" valign="top" style="padding-right: 12px;">
                                                    <!-- Icon container -->
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="32" height="32" style="background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 6px;">
                                                        <tr>
                                                            <td align="center" valign="middle">
                                                                <img src="${iconUrls.email}" alt="Email" width="16" height="16" style="display: block; border: 0; outline: none; text-decoration: none; max-width: 16px; height: auto;">
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td valign="top">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 500; padding-bottom: 4px; font-family: Arial, Helvetica, sans-serif;">
                                                                Email Address
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-size: 14px; color: #e2e8f0; font-weight: 500; letter-spacing: -0.01em; font-family: 'Courier New', Courier, monospace;">
                                                                ${email}
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>

                                        <!-- Connected Wallet Row -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td width="32" valign="top" style="padding-right: 12px;">
                                                    <!-- Icon container -->
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="32" height="32" style="background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 6px;">
                                                        <tr>
                                                            <td align="center" valign="middle">
                                                                <img src="${iconUrls.wallet}" alt="Wallet" width="16" height="16" style="display: block; border: 0; outline: none; text-decoration: none; max-width: 16px; height: auto;">
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td valign="top">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 500; padding-bottom: 4px; font-family: Arial, Helvetica, sans-serif;">
                                                                Connected Wallet
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-size: 14px; color: #e2e8f0; font-weight: 500; letter-spacing: -0.01em; font-family: 'Courier New', Courier, monospace;">
                                                                ${shortWallet}
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>

                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- CTA Button Section -->
                    <tr>
                        <td align="center" style="padding: 0 32px 40px 32px;">
                            <!-- Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                                <tr>
                                    <td align="center">
                                    <!--[if mso]>
                                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${trackedConfirmationUrl}" style="height:48px;v-text-anchor:middle;width:200px;" arcsize="50%" stroke="f" fillcolor="#6366f1">
                                        <w:anchorlock/>
                                        <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:500;">Confirm & Secure Your Spot</center>
                                    </v:roundrect>
                                    <![endif]-->
                                    <!--[if !mso]><!-->
                                    <a href="${trackedConfirmationUrl}" target="_blank" style="display: inline-block; background-color: #6366f1; color: #ffffff; padding: 14px 32px; border-radius: 8px; font-weight: 500; font-size: 14px; letter-spacing: 0.05em; text-align: center; text-decoration: none; font-family: Arial, Helvetica, sans-serif; line-height: 1.2;">
                                        Confirm & Secure Your Spot
                                    </a>
                                    <!--<![endif]-->
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #08080c; border-top: 1px solid rgba(255, 255, 255, 0.05); padding: 32px; text-align: center;">
                            
                            <!-- Social Icons -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 24px auto;">
                                <tr>
                                    <!-- X/Twitter Icon -->
                                    <td style="padding: 0 12px;">
                                        <a href="${socialLinks.x}" target="_blank" style="text-decoration: none; display: inline-block;">
                                            <img src="${socialIcons.x}" alt="X (Twitter)" width="24" height="24" style="display: block; border: 0; outline: none; text-decoration: none; opacity: 0.7; max-width: 24px; height: auto;">
                                        </a>
                                    </td>
                                    <!-- Discord Icon -->
                                    <td style="padding: 0 12px;">
                                        <a href="${socialLinks.discord}" target="_blank" style="text-decoration: none; display: inline-block;">
                                            <img src="${socialIcons.discord}" alt="Discord" width="24" height="24" style="display: block; border: 0; outline: none; text-decoration: none; opacity: 0.7; max-width: 24px; height: auto;">
                                        </a>
                                    </td>
                                    <!-- Telegram Icon -->
                                    <td style="padding: 0 12px;">
                                        <a href="${socialLinks.telegram}" target="_blank" style="text-decoration: none; display: inline-block;">
                                            <img src="${socialIcons.telegram}" alt="Telegram" width="24" height="24" style="display: block; border: 0; outline: none; text-decoration: none; opacity: 0.7; max-width: 24px; height: auto;">
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Footer Text -->
                            <p style="margin: 0 0 16px 0; font-size: 12px; color: #475569; line-height: 1.625; font-family: Arial, Helvetica, sans-serif; max-width: 320px; margin-left: auto; margin-right: auto;">
                                You are receiving this because you signed up for the Hyperkit beta.
                            </p>
                            
                            <!-- Unsubscribe and Privacy Links -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 16px auto 0 auto;">
                                <tr>
                                    <td style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; font-family: Arial, Helvetica, sans-serif;">
                                        <a href="${websiteUrl}?action=unsubscribe" style="color: #475569; text-decoration: none; margin: 0 8px;">Unsubscribe</a>
                                        <span style="color: #1e293b; margin: 0 4px;">|</span>
                                        <a href="${websiteUrl}/privacy" style="color: #475569; text-decoration: none; margin: 0 8px;">Privacy</a>
                                    </td>
                                </tr>
                            </table>
                            
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

function generateConfirmationEmailText(
  email: string,
  walletAddress: string,
  confirmationUrl: string
): string {
  const shortWallet = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  
  return `
🎉 Spot Secured!

Your Hyperkit Waitlist Confirmation

Thank you for joining the Hyperkit waitlist! Your spot has been secured.

This email serves as proof that you've successfully registered for early access to Hyperkit Studio.

Registration Details:
Email: ${email}
Wallet: ${shortWallet}

What's Next?
We'll notify you when Beta Wave 1 launches. Stay tuned for updates!

Confirm Your Email:
${confirmationUrl}

If you didn't request this, please ignore this email.
This is an automated message from Hyperkit.
  `.trim();
}

export async function POST(request: NextRequest) {
  try {
    const { email, walletAddress } = await request.json();

    // Validation
    if (!email || !walletAddress) {
      return NextResponse.json(
        { error: 'Email and wallet address are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Wallet address validation (basic Ethereum address check)
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedWallet = walletAddress.toLowerCase();

    // Check for duplicate email
    const { data: existingEmail } = await supabase
      .from('waitlist_entries')
      .select('id')
      .eq('email', normalizedEmail)
      .single();

    if (existingEmail) {
      return NextResponse.json(
        { error: 'This email is already registered' },
        { status: 409 }
      );
    }

    // Check for duplicate wallet
    const { data: existingWallet } = await supabase
      .from('waitlist_entries')
      .select('id')
      .eq('wallet_address', normalizedWallet)
      .single();

    if (existingWallet) {
      return NextResponse.json(
        { error: 'This wallet is already registered' },
        { status: 409 }
      );
    }

    // Insert new waitlist entry
    const { data: entry, error: insertError } = await supabase
      .from('waitlist_entries')
      .insert({
        email: normalizedEmail,
        wallet_address: normalizedWallet,
        status: 'pending',
        email_confirmed: false,
      })
      .select('id, email, wallet_address, confirmation_token, status, email_confirmed, position')
      .single();

    if (insertError) {
      console.error('Database error:', insertError);
      return NextResponse.json(
        { error: 'Failed to register. Please try again.' },
        { status: 500 }
      );
    }

    // Validate that confirmation_token exists
    if (!entry?.confirmation_token) {
      console.error('Confirmation token missing from entry:', entry);
      return NextResponse.json(
        { error: 'Failed to generate confirmation token. Please try again.' },
        { status: 500 }
      );
    }

    // Automatically add to newsletter (non-blocking - don't fail if this fails)
    try {
      const { error: newsletterError } = await supabase
        .from('newsletter')
        .upsert({
          email: normalizedEmail,
          status: 'active',
          source: 'waitlist',
          // subscribed_at will default to now() if not provided
          // unsubscribed_at will be null for new subscriptions
        }, {
          onConflict: 'email', // Handle duplicate emails gracefully
          ignoreDuplicates: false // Update existing records
        });

      if (newsletterError) {
        // Log error but don't fail the waitlist signup
        console.error('Failed to add to newsletter (non-critical):', newsletterError);
      } else {
        console.log('Successfully added to newsletter:', normalizedEmail);
      }
    } catch (newsletterErr) {
      console.error('Error adding to newsletter (non-critical):', newsletterErr);
      // Don't throw - continue with waitlist signup
    }

    // Send confirmation email
    if (resend && entry) {
      try {
        const appUrl = getAppUrl();
        
        const confirmationUrl = `${appUrl}/api/confirm?token=${entry.confirmation_token}&id=${entry.id}`;
        
        // Resend configuration
        // IMPORTANT: Use the verified subdomain (waitlist.hyperkitlabs.com) not the root domain
        // Based on your DNS records, waitlist.hyperkitlabs.com is verified
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'team@waitlist.hyperkitlabs.com';
        const testEmail = process.env.RESEND_TEST_EMAIL || 'hyperkitdev@gmail.com';
        const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
        
        // In development/testing mode, Resend only allows sending to verified email
        // In production with verified domain, you can send to any email
        const recipientEmail = isProduction ? entry.email : testEmail;
        
        // Add this logging
        console.log('[EMAIL DEBUG]', {
          isProduction,
          NODE_ENV: process.env.NODE_ENV,
          userEmail: entry.email,
          recipientEmail,
          fromEmail,
          confirmationUrl
        });
        
        // Log if we're using test email in development
        if (!isProduction && entry.email !== testEmail) {
          console.log(`[DEV MODE] Email would be sent to ${entry.email}, but redirecting to test email: ${testEmail}`);
        }
        
        await resend.emails.send({
          from: fromEmail,
          to: recipientEmail,
          subject: '🎉 Confirm your spot - Hyperkit Waitlist Confirmation',
          html: generateConfirmationEmail(entry.email, entry.wallet_address, confirmationUrl, entry.id),
          // Text version for better deliverability
          text: generateConfirmationEmailText(entry.email, entry.wallet_address, confirmationUrl),
          // Priority headers for email importance
          headers: {
            'X-Priority': '1', // High priority (1 = High, 3 = Normal, 5 = Low)
            'X-MSMail-Priority': 'High',
            'Importance': 'high',
            'Priority': 'urgent',
            // Add reply-to to improve deliverability
            'Reply-To': fromEmail.includes('<') 
              ? fromEmail.match(/<([^>]+)>/)?.[1] || fromEmail 
              : fromEmail,
          },
          // Tags for tracking
          tags: [
            { name: 'category', value: 'waitlist-confirmation' },
            { name: 'user_id', value: entry.id },
          ],
        });

        // Update confirmation_sent_at
        await supabase
          .from('waitlist_entries')
          .update({ confirmation_sent_at: new Date().toISOString() })
          .eq('id', entry.id);

        // Log email send (optional)
        try {
          const { error: logError } = await supabase
            .from('email_logs')
            .insert({
              waitlist_entry_id: entry.id,
              email_type: 'confirmation',
              status: 'sent',
            });
          
          if (logError) {
            console.error('Failed to log email send:', logError);
            // Don't fail the request, just log the error
          }
        } catch (logErr) {
          console.error('Error logging email send:', logErr);
          // Don't fail the request, just log the error
        }
      } catch (emailError: any) {
        console.error('Email sending error:', emailError);
        
        // Check if it's a Resend validation error (testing mode restriction)
        if (emailError?.message?.includes('testing emails') || emailError?.name === 'validation_error') {
          console.warn('Resend testing mode restriction: Email can only be sent to verified address in testing mode.');
          console.warn('To send to all recipients, verify your domain at: https://resend.com/domains');
        }
        
        // Log failed email attempt
        try {
          const { error: logError } = await supabase
            .from('email_logs')
            .insert({
              waitlist_entry_id: entry.id,
              email_type: 'confirmation',
              status: 'failed',
              error_message: emailError instanceof Error ? emailError.message : 'Unknown error',
            });
          
          if (logError) {
            console.error('Failed to log email failure:', logError);
          }
        } catch (logErr) {
          console.error('Error logging email failure:', logErr);
        }
        // Don't fail the request if email fails, but log it
      }
    } else if (!resend) {
      console.warn('Resend API key not configured. Email not sent.');
    }

    return NextResponse.json({
      success: true,
      message: 'Spot secured! Check your email for confirmation.',
      entry: {
        id: entry.id,
        position: entry.position,
      },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

