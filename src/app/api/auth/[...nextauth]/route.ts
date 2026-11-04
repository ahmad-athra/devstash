import { NextRequest, NextResponse } from "next/server";
import { handlers } from "@/auth";
import {
  checkRateLimit,
  getClientIp,
  getRateLimitErrorMessage,
  getRateLimitKey,
} from "@/lib/rate-limit";

export const { GET } = handlers;

async function extractEmailFromRequest(req: NextRequest): Promise<string> {
  try {
    const cloned = req.clone();
    const contentType = cloned.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = (await cloned.json()) as { email?: unknown };
      return typeof body?.email === "string" ? body.email.toLowerCase().trim() : "";
    }

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const text = await cloned.text();
      const params = new URLSearchParams(text);
      return (params.get("email") || "").toLowerCase().trim();
    }

    if (contentType.includes("multipart/form-data")) {
      const formData = await cloned.formData();
      const email = formData.get("email");
      return typeof email === "string" ? email.toLowerCase().trim() : "";
    }

    const rawText = await cloned.text();
    if (rawText) {
      const params = new URLSearchParams(rawText);
      const paramEmail = params.get("email");
      if (paramEmail) return paramEmail.toLowerCase().trim();
    }
  } catch {
    // Ignore body parsing errors and fall back to IP-only key
  }

  return "";
}

export async function POST(req: NextRequest) {
  if (req.nextUrl.pathname.endsWith("/callback/credentials")) {
    const ip = getClientIp(req);
    const email = await extractEmailFromRequest(req);
    const key = getRateLimitKey(ip, email || "unknown");
    const rateLimit = await checkRateLimit("login", key);

    if (!rateLimit.success) {
      const { message, retryAfterSeconds } = getRateLimitErrorMessage(
        rateLimit.reset
      );
      const redirectUrl = new URL("/sign-in", req.nextUrl.origin);
      redirectUrl.searchParams.set("error", "RateLimitExceeded");
      redirectUrl.searchParams.set("code", message);

      return NextResponse.json(
        {
          error: message,
          url: redirectUrl.toString(),
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfterSeconds),
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "X-RateLimit-Reset": String(rateLimit.reset),
          },
        }
      );
    }
  }

  return handlers.POST(req);
}
