import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="mx-auto bg-red-950/20 border border-red-800/50 p-3 rounded-full w-14 h-14 flex items-center justify-center text-red-500 shadow-lg shadow-red-500/5">
          <XCircle className="h-7 w-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-zinc-100">Missing Token</h2>
          <p className="text-xs text-zinc-400">
            No email verification token was provided. Please check your verification link.
          </p>
        </div>
        <Link
          href="/sign-in"
          className="inline-block w-full bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700/50 text-zinc-200 hover:text-white rounded-lg py-2 text-sm font-semibold transition-all"
        >
          Back to Sign In
        </Link>
      </div>
    );
  }

  // Find the token in the database
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    return (
      <div className="text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="mx-auto bg-red-950/20 border border-red-800/50 p-3 rounded-full w-14 h-14 flex items-center justify-center text-red-500 shadow-lg shadow-red-500/5">
          <XCircle className="h-7 w-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-zinc-100">Invalid Token</h2>
          <p className="text-xs text-zinc-400">
            This verification token is invalid or has already been used.
          </p>
        </div>
        <Link
          href="/sign-in"
          className="inline-block w-full bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700/50 text-zinc-200 hover:text-white rounded-lg py-2 text-sm font-semibold transition-all"
        >
          Back to Sign In
        </Link>
      </div>
    );
  }

  const hasExpired = new Date() > verificationToken.expires;

  if (hasExpired) {
    // Delete the expired token
    await prisma.verificationToken.delete({
      where: { token },
    });

    return (
      <div className="text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="mx-auto bg-orange-950/20 border border-orange-800/50 p-3 rounded-full w-14 h-14 flex items-center justify-center text-orange-500 shadow-lg shadow-orange-500/5">
          <AlertCircle className="h-7 w-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-zinc-100">Token Expired</h2>
          <p className="text-xs text-zinc-400">
            This verification token has expired. You can request a new one below.
          </p>
        </div>
        <Link
          href={`/verify/resend?email=${encodeURIComponent(verificationToken.identifier)}`}
          className="inline-block w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2 text-sm font-semibold transition-all shadow-md shadow-blue-500/10"
        >
          Request New Verification Email
        </Link>
      </div>
    );
  }

  // Update user verified date and delete token
  await prisma.$transaction([
    prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationToken.delete({
      where: { token },
    }),
  ]);

  return (
    <div className="text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
      <div className="mx-auto bg-emerald-950/20 border border-emerald-800/50 p-3 rounded-full w-14 h-14 flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/5">
        <CheckCircle2 className="h-7 w-7" />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold text-zinc-100">Email Verified</h2>
        <p className="text-xs text-zinc-400 font-medium">
          Your email address has been verified.
        </p>
        <p className="text-xs text-zinc-500">
          Your DevStash account is now active and ready.
        </p>
      </div>
      <Link
        href="/sign-in?verified=true"
        className="inline-block w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2 text-sm font-semibold transition-all shadow-md shadow-blue-500/10"
      >
        Sign In to Your Account
      </Link>
    </div>
  );
}
