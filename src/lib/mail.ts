import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.warn("RESEND_API_KEY is not defined. Emails will not be sent.");
}

export const resend = apiKey ? new Resend(apiKey) : null;

/**
 * Sends a verification email to the user with a custom premium HTML template.
 */
export async function sendVerificationEmail(email: string, token: string, baseUrl: string) {
  if (!resend) {
    console.error("Resend is not initialized. Cannot send verification email.");
    return;
  }

  const confirmLink = `${baseUrl}/verify?token=${token}`;

  try {
    const data = await resend.emails.send({
      from: "DevStash <onboarding@resend.dev>",
      to: email,
      subject: "Verify your DevStash account",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #09090b; padding: 40px 20px; text-align: center; color: #f4f4f5; border-radius: 12px; max-width: 560px; margin: 0 auto; border: 1px solid #27272a;">
          <div style="margin-bottom: 24px;">
            <div style="display: inline-flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #2563eb, #7c3aed); width: 48px; height: 48px; border-radius: 10px; margin: 0 auto 12px auto; text-align: center;">
              <span style="color: #ffffff; font-size: 24px; font-weight: bold; line-height: 48px; display: block; width: 100%;">D</span>
            </div>
            <h1 style="font-size: 22px; font-weight: 800; letter-spacing: 0.05em; margin: 0; color: #ffffff;">DevStash</h1>
            <p style="font-size: 9px; font-family: monospace; color: #71717a; text-transform: uppercase; letter-spacing: 0.15em; margin: 4px 0 0 0;">Developer Knowledge Cockpit</p>
          </div>
          
          <div style="background-color: #18181b; border: 1px solid #27272a; padding: 32px; border-radius: 8px; margin-bottom: 24px; text-align: left;">
            <h2 style="font-size: 18px; font-weight: 600; color: #ffffff; margin-top: 0; margin-bottom: 12px; text-align: left;">Confirm your email address</h2>
            <p style="font-size: 14px; color: #a1a1aa; line-height: 1.6; margin-bottom: 24px; text-align: left;">
              Thank you for signing up for DevStash! To activate your account and start stashing your code snippets, prompts, notes, and links, please click the button below to verify your email:
            </p>
            <div style="text-align: center; margin-bottom: 24px; margin-top: 24px;">
              <a href="${confirmLink}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; border: 1px solid #3b82f6;">
                Verify Email Address
              </a>
            </div>
            <p style="font-size: 12px; color: #71717a; line-height: 1.5; text-align: left; border-top: 1px solid #27272a; padding-top: 16px; margin-top: 16px;">
              Or copy and paste this URL into your browser:
              <br />
              <a href="${confirmLink}" style="color: #3b82f6; text-decoration: none; word-break: break-all;">${confirmLink}</a>
            </p>
          </div>
          
          <div style="text-align: center; font-size: 11px; color: #52525b;">
            <p style="margin: 0 0 8px 0;">This email verification link will expire in 24 hours.</p>
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} DevStash. All rights reserved.</p>
          </div>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return { success: false, error };
  }
}

/**
 * Sends a password reset email to the user with a custom premium HTML template.
 */
export async function sendPasswordResetEmail(email: string, token: string, baseUrl: string) {
  if (!resend) {
    console.error("Resend is not initialized. Cannot send password reset email.");
    return;
  }

  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  try {
    const data = await resend.emails.send({
      from: "DevStash <onboarding@resend.dev>",
      to: email,
      subject: "Reset your DevStash password",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #09090b; padding: 40px 20px; text-align: center; color: #f4f4f5; border-radius: 12px; max-width: 560px; margin: 0 auto; border: 1px solid #27272a;">
          <div style="margin-bottom: 24px;">
            <div style="display: inline-flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #2563eb, #7c3aed); width: 48px; height: 48px; border-radius: 10px; margin: 0 auto 12px auto; text-align: center;">
              <span style="color: #ffffff; font-size: 24px; font-weight: bold; line-height: 48px; display: block; width: 100%;">D</span>
            </div>
            <h1 style="font-size: 22px; font-weight: 800; letter-spacing: 0.05em; margin: 0; color: #ffffff;">DevStash</h1>
            <p style="font-size: 9px; font-family: monospace; color: #71717a; text-transform: uppercase; letter-spacing: 0.15em; margin: 4px 0 0 0;">Developer Knowledge Cockpit</p>
          </div>
          
          <div style="background-color: #18181b; border: 1px solid #27272a; padding: 32px; border-radius: 8px; margin-bottom: 24px; text-align: left;">
            <h2 style="font-size: 18px; font-weight: 600; color: #ffffff; margin-top: 0; margin-bottom: 12px; text-align: left;">Reset your password</h2>
            <p style="font-size: 14px; color: #a1a1aa; line-height: 1.6; margin-bottom: 24px; text-align: left;">
              We received a request to reset the password for your DevStash account. If you didn't make this request, you can safely ignore this email.
            </p>
            <div style="text-align: center; margin-bottom: 24px; margin-top: 24px;">
              <a href="${resetLink}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; border: 1px solid #3b82f6;">
                Reset Password
              </a>
            </div>
            <p style="font-size: 12px; color: #71717a; line-height: 1.5; text-align: left; border-top: 1px solid #27272a; padding-top: 16px; margin-top: 16px;">
              Or copy and paste this URL into your browser:
              <br />
              <a href="${resetLink}" style="color: #3b82f6; text-decoration: none; word-break: break-all;">${resetLink}</a>
            </p>
          </div>
          
          <div style="text-align: center; font-size: 11px; color: #52525b;">
            <p style="margin: 0 0 8px 0;">This password reset link will expire in 24 hours.</p>
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} DevStash. All rights reserved.</p>
          </div>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    return { success: false, error };
  }
}
