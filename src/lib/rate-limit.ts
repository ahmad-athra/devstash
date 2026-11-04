import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

export type RateLimitType =
  | "login"
  | "register"
  | "forgotPassword"
  | "resetPassword"
  | "resendVerification";

const RATE_LIMIT_CONFIGS: Record<
  RateLimitType,
  { requests: number; window: `${number} ${"s" | "m" | "h" | "d"}`; prefix: string }
> = {
  login: {
    requests: 5,
    window: "15 m",
    prefix: "ratelimit:auth:login",
  },
  register: {
    requests: 3,
    window: "1 h",
    prefix: "ratelimit:auth:register",
  },
  forgotPassword: {
    requests: 3,
    window: "1 h",
    prefix: "ratelimit:auth:forgot-password",
  },
  resetPassword: {
    requests: 5,
    window: "15 m",
    prefix: "ratelimit:auth:reset-password",
  },
  resendVerification: {
    requests: 3,
    window: "15 m",
    prefix: "ratelimit:auth:resend-verification",
  },
};

let redisClient: Redis | null = null;
const rateLimiters: Partial<Record<RateLimitType, Ratelimit>> = {};

function getRedisClient(): Redis | null {
  if (redisClient) return redisClient;

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!url || !token) {
    return null;
  }

  try {
    redisClient = new Redis({ url, token });
    return redisClient;
  } catch (error) {
    console.error("Failed to initialize Upstash Redis client:", error);
    return null;
  }
}

function getRateLimiter(type: RateLimitType): Ratelimit | null {
  if (rateLimiters[type]) {
    return rateLimiters[type]!;
  }

  const redis = getRedisClient();
  if (!redis) {
    return null;
  }

  const config = RATE_LIMIT_CONFIGS[type];
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.requests, config.window),
    prefix: config.prefix,
    analytics: false,
  });

  rateLimiters[type] = limiter;
  return limiter;
}

/**
 * Extracts client IP address from request or headers (`x-forwarded-for`, `x-real-ip`).
 */
export function getClientIp(reqOrHeaders?: NextRequest | Request | Headers): string {
  if (!reqOrHeaders) {
    return "127.0.0.1";
  }

  const headers =
    reqOrHeaders instanceof Headers ? reqOrHeaders : reqOrHeaders.headers;

  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) {
    return realIp;
  }

  return "127.0.0.1";
}

/**
 * Builds a rate limit key from IP and optional identifier (such as email).
 */
export function getRateLimitKey(ip: string, identifier?: string): string {
  const cleanIp = ip.trim() || "127.0.0.1";
  if (!identifier) {
    return cleanIp;
  }
  return `${cleanIp}:${identifier.toLowerCase().trim()}`;
}

/**
 * Checks rate limit for a given endpoint type and key.
 * Fails open (returns success: true) if Upstash is unavailable or throws an error.
 */
export async function checkRateLimit(
  type: RateLimitType,
  key: string
): Promise<RateLimitResult> {
  const fallbackRequests = RATE_LIMIT_CONFIGS[type].requests;

  try {
    const limiter = getRateLimiter(type);
    if (!limiter) {
      return {
        success: true,
        remaining: fallbackRequests,
        reset: Date.now(),
      };
    }

    const { success, remaining, reset } = await limiter.limit(key);
    return { success, remaining, reset };
  } catch (error) {
    console.error(`Rate limit check failed for ${type} (failing open):`, error);
    return {
      success: true,
      remaining: fallbackRequests,
      reset: Date.now(),
    };
  }
}

/**
 * Formats the remaining wait time in minutes and builds the user-facing error message.
 */
export function getRateLimitErrorMessage(reset: number): {
  message: string;
  retryAfterSeconds: number;
} {
  const diffMs = Math.max(0, reset - Date.now());
  const retryAfterSeconds = Math.max(1, Math.ceil(diffMs / 1000));
  const minutes = Math.max(1, Math.ceil(diffMs / 60000));

  return {
    message: `Too many attempts. Please try again in ${minutes} ${minutes === 1 ? "minute" : "minutes"}.`,
    retryAfterSeconds,
  };
}

/**
 * Creates a standardized 429 Too Many Requests JSON response with Retry-After header.
 */
export function createRateLimitResponse(result: RateLimitResult): NextResponse {
  const { message, retryAfterSeconds } = getRateLimitErrorMessage(result.reset);

  return NextResponse.json(
    { error: message },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
        "X-RateLimit-Remaining": String(result.remaining),
        "X-RateLimit-Reset": String(result.reset),
      },
    }
  );
}

