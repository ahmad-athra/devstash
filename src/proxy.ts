import { auth } from "@/auth";

export const proxy = auth((req) => {
  if (!req.auth) {
    const url = new URL("/sign-in", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", req.nextUrl.href);
    return Response.redirect(url);
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/collections/:path*", "/items/:path*"],
};
