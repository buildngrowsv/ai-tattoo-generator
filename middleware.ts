/**
 * middleware.ts — next-intl locale routing middleware.
 *
 * Intercepts all non-API, non-static requests and redirects/rewrites them
 * to the correct locale prefix. English stays at "/" (no /en prefix) and
 * Spanish moves to "/es/*" — defined in src/i18n/routing.ts.
 *
 * Builder 11 (2026-03-25): Added for pane1774 swarm T13 — clone fleet EN+ES.
 */
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all routes except: API routes, Next.js internals, Vercel internals,
  // and static files (anything with a file extension like .ico, .png, .css)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
