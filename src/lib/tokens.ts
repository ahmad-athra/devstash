import { prisma } from "@/lib/prisma";
import crypto from "crypto";

/**
 * Generates a new verification token for the specified email.
 * If a token already exists for the email, it is deleted before creating the new one.
 * The token will expire in 24 hours.
 */
export async function generateVerificationToken(email: string) {
  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Check if an existing token exists for this email and delete it
  const existingToken = await prisma.verificationToken.findFirst({
    where: { identifier: email },
  });

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        token: existingToken.token,
      },
    });
  }

  // Create the new verification token
  const verificationToken = await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return verificationToken;
}

/**
 * Generates a new password reset token for the specified email.
 * This reuses the VerificationToken model. If a token exists, it is replaced.
 * The token will expire in 24 hours.
 */
export async function generatePasswordResetToken(email: string) {
  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Check if an existing token exists for this email and delete it
  const existingToken = await prisma.verificationToken.findFirst({
    where: { identifier: email },
  });

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        token: existingToken.token,
      },
    });
  }

  // Create the new token
  const resetToken = await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return resetToken;
}
