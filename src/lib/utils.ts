/**
 * UTILITY FUNCTIONS — AI Tattoo Generator
 *
 * Shared utility functions used across the application. Currently contains
 * the className merger utility (cn) which is the standard pattern across
 * all our projects for combining Tailwind classes safely.
 *
 * WHY clsx + tailwind-merge:
 * - clsx handles conditional class names (e.g., cn("base", isActive && "active"))
 * - tailwind-merge deduplicates conflicting Tailwind classes (e.g., "p-2 p-4" -> "p-4")
 * - Together they let components accept className props without style conflicts
 *
 * This is the exact same utility used in shadcn/ui and our saas-clone-template.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn — Combine and merge CSS class names safely.
 *
 * Used throughout all components when composing Tailwind classes.
 * Handles conditional classes, arrays, and resolves Tailwind conflicts.
 *
 * Example: cn("p-2 text-red-500", isLarge && "p-4 text-blue-500")
 * Result when isLarge=true: "p-4 text-blue-500" (p-2 and text-red-500 are overridden)
 *
 * Called by: Every component that accepts a className prop.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
