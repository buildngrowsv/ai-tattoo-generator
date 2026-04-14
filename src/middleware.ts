/**
 * Edge middleware — locale detection + next-intl routing.
 *
 * API routes and static assets bypass i18n. Everything else is handled by
 * next-intl (redirect `/` → default locale internally, `/es/*` for Spanish).
 */
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|vs|guide|privacy|terms|refund-policy|.*\\.|for|use-cases|best|blog|lp|testimonials|ai-|pricing|privacy-policy|terms-of-service|get-started.*).*)"],
};
