import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token and new password are required." }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    // Find the verification token
    const existingToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return NextResponse.json({ error: "Invalid token." }, { status: 400 });
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return NextResponse.json({ error: "Token has expired." }, { status: 400 });
    }

    // Find the user by the token identifier (email)
    const user = await prisma.user.findUnique({
      where: { email: existingToken.identifier },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password.
    // As per the user's request, we also set emailVerified to true (current Date)
    // because successfully resetting a password via an email link proves email ownership.
    // This allows unverified users to become verified automatically during password reset.
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        emailVerified: new Date(),
      },
    });

    // Delete the token so it cannot be reused
    await prisma.verificationToken.delete({
      where: { token: existingToken.token },
    });

    return NextResponse.json({ message: "Password updated successfully." }, { status: 200 });
  } catch (error) {
    console.error("Reset password API error:", error);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}
