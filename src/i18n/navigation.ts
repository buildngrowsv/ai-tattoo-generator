/**
 * Locale-aware navigation primitives from next-intl.
 *
 * Use `Link` / `useRouter` from here instead of `next/link` so `/es` prefix
 * is applied automatically for Spanish routes.
 */
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
