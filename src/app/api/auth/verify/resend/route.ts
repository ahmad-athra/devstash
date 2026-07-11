import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if the user exists in the database
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // Return a successful status message to prevent email enumeration
      return NextResponse.json(
        { message: "If this email is registered, a new verification link has been sent." },
        { status: 200 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "This email address is already verified. Please sign in.", alreadyVerified: true },
        { status: 400 }
      );
    }

    // Generate a new token and trigger verification email
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const baseUrl = `${protocol}://${host}`;

    const token = await generateVerificationToken(normalizedEmail);
    await sendVerificationEmail(normalizedEmail, token.token, baseUrl);

    return NextResponse.json(
      { message: "Verification link sent successfully. Please check your inbox." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend verification API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
