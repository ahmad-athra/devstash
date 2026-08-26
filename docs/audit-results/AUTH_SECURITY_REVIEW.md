# Authentication Security Audit Report

**Date:** 2026-08-26
**Auditor:** Antigravity (Auth-Auditor)
**Scope:** NextAuth configuration, custom credential flows, password reset, email verification, and profile updates.

## Executive Summary
The authentication implementation securely leverages NextAuth for session management and properly enforces single-use token constraints for password resets. However, the custom credential flows lack rate limiting and have potential timing attack vectors that could allow user enumeration. Tokens are also stored in plaintext in the database.

## 🟢 Passed Checks

- **Single-Use Password Reset Tokens:** `api/auth/reset-password/route.ts` successfully deletes the verification token upon use, ensuring it cannot be reused.
- **Session Validation & Authorization:** `api/user/password/route.ts` correctly verifies the current user's session before allowing a password update, mitigating IDOR vulnerabilities.
- **NextAuth Secure Defaults:** The application appropriately inherits NextAuth's CSRF protection, secure session management, and HTTP-only cookies.
- **Current Password Requirement:** The profile password update correctly requires and verifies the current password before applying a new one.

## 🔴 Vulnerability Findings

### High Severity

#### 1. Missing Rate Limiting on Authentication Endpoints
**Description:** There is no rate limiting on the `/api/auth/register`, `/api/auth/forgot-password`, `/api/auth/reset-password`, and `/api/user/password` endpoints. This exposes the application to brute-force credential stuffing, password guessing, and malicious email spamming through the forgot password flow.
**Recommendation:** Implement rate limiting (e.g., using Upstash Redis or a local memory store) to strictly limit the number of requests per IP address or user identifier within a specific time window.

### Medium Severity

#### 2. Verification Tokens Stored in Plaintext
**Description:** The `VerificationToken` records in `lib/tokens.ts` are stored in plaintext in the database (`token = crypto.randomUUID()`). If the database is compromised (e.g., via a SQL injection or unauthorized access), an attacker could use valid tokens to reset passwords and take over accounts.
**Recommendation:** Hash the token (e.g., using `crypto.createHash('sha256')`) before storing it in the database. When verifying a token, hash the incoming URL parameter and compare it against the stored hash.

#### 3. User Enumeration via Timing Attacks (Login & Forgot Password)
**Description:** 
- In `auth.ts` (`authorize`), if a user is not found, the function returns immediately. If the user is found, it performs an expensive `bcrypt.compare` operation. 
- In `api/auth/forgot-password/route.ts`, token generation and email dispatch only occur if the user exists. 
An attacker can measure response times to accurately enumerate which email addresses are registered in the system.
**Recommendation:** 
- For login: Execute a dummy `bcrypt.compare` with a hardcoded hash if the user does not exist to equalize response times.
- For forgot password: If preventing enumeration is a strict requirement, move the email dispatch to a background job/queue, ensuring the HTTP response time is constant.

### Low Severity

#### 4. Excessive Token Expiration Duration
**Description:** In `lib/tokens.ts`, both `generateVerificationToken` and `generatePasswordResetToken` set a 24-hour expiration (`24 * 60 * 60 * 1000`). While acceptable for initial email verification, 24 hours is excessively long for a password reset token, unnecessarily widening the window for token interception or reuse.
**Recommendation:** Reduce the password reset token expiration to 15–60 minutes.

#### 5. Suboptimal Bcrypt Work Factor
**Description:** Password hashing in `api/auth/register/route.ts` and `api/user/password/route.ts` uses a bcrypt work factor of `10` (`bcrypt.hash(password, 10)`). Modern security standards suggest a higher work factor to defend against advancements in hardware computing power.
**Recommendation:** Increase the bcrypt work factor to at least `12`, ensuring a good balance between security and server performance.

#### 6. Explicit Email Enumeration on Registration
**Description:** The `/api/auth/register` endpoint explicitly returns a 400 error stating "A user with this email already exists." While common in consumer apps for UX purposes, it explicitly leaks user registration status.
**Recommendation:** If strict privacy is required, return a generic success message and send a "You already have an account" notification email to the existing user instead.
