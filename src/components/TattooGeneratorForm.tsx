/**
 * TATTOO GENERATOR FORM — The Core Interactive Component
 *
 * This is the primary user interaction point of the entire application.
 * It's placed directly in the hero section of the landing page so users
 * can immediately start generating tattoo designs without scrolling or
 * navigating. This follows the PLG (Product-Led Growth) strategy where
 * the product IS the marketing — let users experience value before asking
 * them to pay.
 *
 * FORM FIELDS:
 * 1. Tattoo Description (textarea) — Free-form creative input
 * 2. Style Selector (chip grid) — 10 tattoo styles as clickable chips
 * 3. Placement Selector (dropdown) — Body part for the tattoo
 * 4. Size Selector (radio buttons) — Small / Medium / Large
 * 5. Generate Button — Triggers /api/generate POST
 * 6. Result Display — Shows the generated image or error state
 *
 * WHY A CHIP GRID FOR STYLES (instead of a dropdown):
 * Tattoo styles are a visual concept — users need to SEE the options to
 * make a meaningful choice. A dropdown hides all options behind a click.
 * The chip grid shows all 10 styles at once, reducing cognitive load and
 * making the form feel more interactive/fun. This is the same pattern used
 * by Canva's template selector and Midjourney's style picker.
 *
 * STATE MANAGEMENT:
 * Uses React useState hooks for local form state. No need for a form
 * library (react-hook-form, formik) because:
 * - Only 4 fields — not enough complexity to justify a dependency
 * - No complex validation (server validates too)
 * - No nested/dynamic fields
 * - Keeping dependencies minimal for fast builds
 *
 * ARCHITECTURE:
 * This is a Client Component ("use client") because it needs:
 * - useState for form state and loading state
 * - Event handlers (onChange, onClick, onSubmit)
 * - fetch API for calling /api/generate
 * The parent page.tsx is a Server Component that imports this.
 *
 * CALLED BY: src/app/page.tsx (landing page hero section)
 * DEPENDS ON: /api/generate route handler, lucide-react icons
 */

"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Sparkles,
  Loader2,
  Download,
  AlertCircle,
  Paintbrush,
  MapPin,
  Maximize2,
  Crown,
} from "lucide-react";

/**
 * TATTOO_STYLE_OPTIONS — The 10 tattoo styles available for generation.
 *
 * These were chosen based on the most popular tattoo styles that:
 * 1. Have distinct visual characteristics (important for prompt engineering)
 * 2. Are commonly searched for ("watercolor tattoo", "geometric tattoo", etc.)
 * 3. Cover the full spectrum from traditional to modern
 * 4. Are well-represented in AI training data (model can reproduce them accurately)
 *
 * Each style maps to a detailed prompt modifier in the API route
 * (src/app/api/generate/route.ts) that guides the AI model to produce
 * style-authentic output.
 */
const TATTOO_STYLE_OPTIONS = [
  "Traditional",
  "Watercolor",
  "Geometric",
  "Japanese",
  "Minimalist",
  "Blackwork",
  "Tribal",
  "Realism",
  "Neo-Traditional",
  "Dotwork",
] as const;

/**
 * BODY_PLACEMENT_OPTIONS — Where the tattoo will be placed on the body.
 *
 * Placement affects the AI-generated composition:
 * - Narrow areas (Wrist, Ankle) need horizontal/wrap-around designs
 * - Large flat areas (Back, Chest) can have complex scenes
 * - Curved areas (Shoulder, Ribs) benefit from flowing compositions
 *
 * The placement is sent to the API route where it influences the prompt
 * construction — e.g., "designed for forearm placement" helps the model
 * produce appropriately proportioned designs.
 */
const BODY_PLACEMENT_OPTIONS = [
  "Arm",
  "Forearm",
  "Back",
  "Chest",
  "Leg",
  "Ankle",
  "Shoulder",
  "Neck",
  "Wrist",
  "Ribs",
] as const;

/**
 * TATTOO_SIZE_OPTIONS — How large the tattoo will be.
 *
 * Size controls the level of detail in the generated design:
 * - Small: Simple, clean, few elements — looks good at 2-3 inch scale
 * - Medium: Moderate detail, clear focal point — 4-6 inch scale
 * - Large: Complex, intricate, many elements — 7+ inch scale or full sleeve
 *
 * This is important because a design meant for a small wrist tattoo
 * should NOT have the same complexity as a full back piece — it would
 * look like a blob when actually tattooed at that size.
 */
const TATTOO_SIZE_OPTIONS = ["Small", "Medium", "Large"] as const;

/**
 * GenerationResult — The shape of a successful API response.
 *
 * Matches the response format from /api/generate route handler.
 * The imageUrl points to fal.ai's CDN where the generated image is hosted.
 * The prompt is included for transparency so users can see what was sent to the AI.
 */
interface GenerationResult {
  imageUrl: string;
  prompt: string;
  width: number;
  height: number;
}

/**
 * GenerationError — The shape of an error API response.
 *
 * Both the error code and a human-readable message are returned
 * so the UI can display helpful error information to the user.
 */
interface GenerationError {
  error: string;
  message: string;
}

/**
 * TattooGeneratorForm — The main interactive tattoo design generation form.
 *
 * This single component contains all form state, validation, API communication,
 * and result display. It's intentionally self-contained (one component, one file)
 * following our "one function per file" principle.
 *
 * RENDERING:
 * - The form itself is always visible (it's the hero demo)
 * - The result area appears below the form after generation
 * - Loading state shows a shimmer effect on the generate button
 * - Error state shows an alert with the error message
 */
/**
 * DAILY_FREE_GENERATION_LIMIT — Maximum free generations per day.
 *
 * WHY 3 (not 1, not 5, not 10):
 * - 1 is too stingy — users can't meaningfully explore the tool
 * - 5+ is too generous — most users won't feel the need to upgrade
 * - 3 is the sweet spot: enough to see value, not enough for heavy use
 * - At ~$0.03/generation, 3 free/day costs us ~$0.09/user/day max
 * - Power users (tattoo artists testing many ideas) hit the limit fast
 *   and have the strongest motivation to pay $9.90/mo
 *
 * STORAGE: localStorage keyed by date string (YYYY-MM-DD).
 * This is CLIENT-SIDE ONLY — it's a UX gate, not a security boundary.
 * Real enforcement happens server-side via IP rate limiting in the API route.
 * A determined user could clear localStorage to bypass this, which is fine:
 * they still hit the server-side rate limit, and the friction of clearing
 * storage repeatedly is enough to convert most users to Pro.
 */
const DAILY_FREE_GENERATION_LIMIT = 3;

/**
 * getLocalStorageUsageKey — Returns the localStorage key for today's usage count.
 * Format: "tattoo-gen-usage-2026-03-24" so it auto-expires daily.
 */
function getLocalStorageUsageKey(): string {
  const todayDateString = new Date().toISOString().split("T")[0];
  return `tattoo-gen-usage-${todayDateString}`;
}

/**
 * getTodayGenerationCount — Reads today's generation count from localStorage.
 * Returns 0 if no usage recorded yet (new day, cleared storage, first visit).
 */
function getTodayGenerationCount(): number {
  if (typeof window === "undefined") return 0;
  const storedCountString = localStorage.getItem(getLocalStorageUsageKey());
  return storedCountString ? parseInt(storedCountString, 10) : 0;
}

/**
 * incrementTodayGenerationCount — Bumps today's usage count by 1.
 * Called after a successful generation (not on error or rate limit).
 */
function incrementTodayGenerationCount(): void {
  if (typeof window === "undefined") return;
  const currentCount = getTodayGenerationCount();
  localStorage.setItem(getLocalStorageUsageKey(), String(currentCount + 1));
}

export default function TattooGeneratorForm() {
  const t = useTranslations("Form");
  const tStyle = useTranslations("Form.Styles");
  const tPlacement = useTranslations("Form.Placements");
  const tSize = useTranslations("Form.Sizes");

  /**
   * Form state — controlled inputs for all form fields.
   * Default selections are chosen to be the most common/popular options
   * so users can hit "Generate" immediately with just a description.
   */
  const [tattooDescriptionInput, setTattooDescriptionInput] = useState("");
  const [selectedTattooStyle, setSelectedTattooStyle] = useState<string>("Traditional");
  const [selectedBodyPlacement, setSelectedBodyPlacement] = useState<string>("Forearm");
  const [selectedTattooSize, setSelectedTattooSize] = useState<string>("Medium");

  /**
   * Generation state — tracks the async generation process.
   * isCurrentlyGenerating prevents double-submission and shows loading UI.
   * generationResult and generationError are mutually exclusive — when one
   * is set, the other should be null.
   */
  const [isCurrentlyGenerating, setIsCurrentlyGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [generationError, setGenerationError] = useState<GenerationError | null>(null);

  /**
   * Usage tracking state — shows remaining free generations and upgrade prompt.
   *
   * WHY useState + useEffect (not just reading localStorage directly):
   * - localStorage reads are synchronous but not available during SSR
   * - We need to re-render the UI when the count changes (after generation)
   * - The count display in the UI needs to be reactive
   *
   * hasReachedDailyFreeLimit gates the generate button and shows the upgrade CTA.
   * todayUsageCount is displayed as "X of 3 free generations used today".
   */
  const [todayUsageCount, setTodayUsageCount] = useState(0);
  const [hasReachedDailyFreeLimit, setHasReachedDailyFreeLimit] = useState(false);

  /**
   * Initialize usage count from localStorage on mount.
   * Must be in useEffect because localStorage is not available during SSR.
   *
   * NOTE (Builder 25, 2026-03-25): Previous code incorrectly used useState with a
   * side-effect callback; that pattern never runs. useEffect is the correct hook.
   */
  useEffect(() => {
    const count = getTodayGenerationCount();
    setTodayUsageCount(count);
    setHasReachedDailyFreeLimit(count >= DAILY_FREE_GENERATION_LIMIT);
  }, []);

  /**
   * handleGenerateTattooDesign — Submits the form to /api/generate.
   *
   * This function:
   * 1. Validates that a description is provided (client-side pre-check)
   * 2. Sets loading state
   * 3. POSTs to /api/generate with all form data
   * 4. Handles success (shows image) or error (shows message)
   * 5. Clears loading state
   *
   * The server also validates all fields, so this client validation is
   * just for UX — prevents unnecessary network requests.
   */
  async function handleGenerateTattooDesign() {
    /**
     * Prevent submission without a description.
     * The style, placement, and size always have defaults, so only the
     * description needs explicit validation.
     */
    if (!tattooDescriptionInput.trim()) {
      setGenerationError({
        error: t("errMissingDescription"),
        message: t("errMissingDescriptionMsg"),
      });
      return;
    }

    /**
     * USAGE GATE — Check if user has exceeded free daily limit.
     *
     * This is the client-side UX gate. When the user hits 3/day, we show
     * an upgrade prompt instead of making the API call. This saves server
     * costs (no wasted fal.ai calls) and creates a clear conversion moment.
     *
     * Server-side rate limiting in /api/generate is the real enforcement.
     * This client-side check is for UX — showing a friendly upgrade prompt
     * instead of a generic "rate limited" error.
     */
    const currentUsageCount = getTodayGenerationCount();
    if (currentUsageCount >= DAILY_FREE_GENERATION_LIMIT) {
      setHasReachedDailyFreeLimit(true);
      setTodayUsageCount(currentUsageCount);
      setGenerationError({
        error: t("errDailyLimit"),
        message: t("errDailyLimitMsg", { limit: DAILY_FREE_GENERATION_LIMIT }),
      });
      return;
    }

    /**
     * Reset state for new generation attempt.
     * Clear any previous result/error and set loading state.
     */
    setIsCurrentlyGenerating(true);
    setGenerationResult(null);
    setGenerationError(null);

    try {
      const apiResponse = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tattooDescription: tattooDescriptionInput.trim(),
          style: selectedTattooStyle,
          placement: selectedBodyPlacement,
          size: selectedTattooSize,
        }),
      });

      const responseData = await apiResponse.json();

      if (!apiResponse.ok) {
        /**
         * API returned an error — display it to the user.
         * The API always returns { error, message } on failure.
         */
        setGenerationError(responseData as GenerationError);
      } else {
        /**
         * Success — store the result for display.
         * The result contains imageUrl, prompt, width, and height.
         *
         * USAGE TRACKING: Increment the daily count AFTER a successful generation.
         * We don't count failed attempts — that would be unfair to users who hit
         * a server error. Only actual successful generations consume a "credit".
         */
        setGenerationResult(responseData as GenerationResult);
        incrementTodayGenerationCount();
        const newCount = getTodayGenerationCount();
        setTodayUsageCount(newCount);
        setHasReachedDailyFreeLimit(newCount >= DAILY_FREE_GENERATION_LIMIT);
      }
    } catch (networkError) {
      /**
       * Network error — the request didn't reach the server.
       * This usually means the user is offline or the server is down.
       */
      console.error("Network error during tattoo generation:", networkError);
      setGenerationError({
        error: t("errNetwork"),
        message: t("errNetworkMsg"),
      });
    } finally {
      setIsCurrentlyGenerating(false);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* ================================================================
          THE GENERATOR CARD — Main form container

          Uses the glow-border utility class for a subtle purple glow effect
          that draws attention to this as the primary interactive element.
          The dark card background (zinc-900) provides contrast against the
          page background (zinc-950) while staying within the dark theme.
          ================================================================ */}
      <div className="glow-border rounded-2xl bg-card p-6 sm:p-8">
        {/* Form header — sets expectations about what the form does */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{t("cardTitle")}</h2>
            <p className="text-sm text-muted-foreground">{t("cardSubtitle")}</p>
          </div>
        </div>

        {/* ============================================================
            FIELD 1: Tattoo Description (textarea)

            This is the most important input — it's the user's creative
            vision. The textarea is large (4 rows) to encourage detailed
            descriptions, which produce better results. The placeholder
            text gives a concrete example to reduce blank-page anxiety.
            ============================================================ */}
        <div className="space-y-5">
          <div>
            <label
              htmlFor="tattoo-description-input"
              className="flex items-center gap-2 text-sm font-medium text-foreground mb-2"
            >
              <Paintbrush className="w-4 h-4 text-primary" />
              {t("describeLabel")}
            </label>
            <textarea
              id="tattoo-description-input"
              value={tattooDescriptionInput}
              onChange={(e) => setTattooDescriptionInput(e.target.value)}
              placeholder={t("placeholder")}
              rows={4}
              maxLength={1000}
              className="w-full rounded-xl bg-muted border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 resize-none transition-all text-sm leading-relaxed"
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              {t("charHint", { count: tattooDescriptionInput.length })}
            </p>
          </div>

          {/* ============================================================
              FIELD 2: Style Selector (chip grid)

              Shows all 10 styles as clickable chips in a wrapping flex grid.
              The selected chip gets a primary color highlight. Using chips
              instead of a dropdown because:
              1. All options are visible at once (no hidden state)
              2. Visual scanning is faster than reading a dropdown list
              3. Feels more interactive and "fun" — important for a creative tool
              4. The chip pattern is familiar from apps like Instagram filters
              ============================================================ */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
              <Paintbrush className="w-4 h-4 text-primary" />
              {t("styleLabel")}
            </label>
            <div className="flex flex-wrap gap-2">
              {TATTOO_STYLE_OPTIONS.map((styleOption) => (
                <button
                  key={styleOption}
                  type="button"
                  onClick={() => setSelectedTattooStyle(styleOption)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedTattooStyle === styleOption
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-border"
                  }`}
                >
                  {tStyle(styleOption)}
                </button>
              ))}
            </div>
          </div>

          {/* ============================================================
              FIELDS 3 & 4: Placement and Size (side by side on desktop)

              These are secondary options that modify the generation but
              are less important than the description and style. Placing
              them side-by-side on desktop saves vertical space and groups
              them visually as "configuration" options.
              ============================================================ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Placement selector — dropdown because there are 10 options
                and they're text-only (no visual component needed) */}
            <div>
              <label
                htmlFor="body-placement-selector"
                className="flex items-center gap-2 text-sm font-medium text-foreground mb-2"
              >
                <MapPin className="w-4 h-4 text-primary" />
                {t("placementLabel")}
              </label>
              <select
                id="body-placement-selector"
                value={selectedBodyPlacement}
                onChange={(e) => setSelectedBodyPlacement(e.target.value)}
                className="w-full rounded-xl bg-muted border border-border px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm appearance-none cursor-pointer"
              >
                {BODY_PLACEMENT_OPTIONS.map((placementOption) => (
                  <option key={placementOption} value={placementOption}>
                    {tPlacement(placementOption)}
                  </option>
                ))}
              </select>
            </div>

            {/* Size selector — radio-style buttons because there are only 3
                options and they represent a scale (small to large). Showing
                all 3 at once communicates the range clearly. */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Maximize2 className="w-4 h-4 text-primary" />
                {t("sizeLabel")}
              </label>
              <div className="flex gap-2">
                {TATTOO_SIZE_OPTIONS.map((sizeOption) => (
                  <button
                    key={sizeOption}
                    type="button"
                    onClick={() => setSelectedTattooSize(sizeOption)}
                    className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedTattooSize === sizeOption
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-border"
                    }`}
                  >
                    {tSize(sizeOption)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ============================================================
              GENERATE BUTTON — The primary CTA

              Full-width, prominent gradient button. Uses a loading spinner
              during generation. Disabled while generating to prevent
              double-submission (which would cost us double API credits).

              The gradient (purple-to-blue) matches the brand identity and
              stands out clearly against the dark card background.
              ============================================================ */}
          {/* ============================================================
              USAGE COUNTER — Shows remaining free generations.

              Displays "X of 3 free generations used today" below the button.
              When limit is reached, the button changes to an upgrade CTA
              that links to the pricing section (smooth scroll).

              WHY SHOW THE COUNTER (not just block silently):
              Transparency builds trust. Users who can SEE their remaining
              credits are more likely to value each generation and more
              receptive to the upgrade prompt when the limit hits. This is
              the same pattern used by ChatGPT, Canva, and Midjourney.
              ============================================================ */}
          {hasReachedDailyFreeLimit ? (
            <Link
              href="/pricing"
              className="w-full py-4 px-6 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 transition-all duration-200 shadow-lg shadow-amber-600/25 hover:shadow-amber-500/35 flex items-center justify-center gap-2"
            >
              <Crown className="w-5 h-5" />
              {t("upgradeCta")}
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleGenerateTattooDesign}
              disabled={isCurrentlyGenerating}
              className="w-full py-4 px-6 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-violet-600/25 hover:shadow-violet-500/35 flex items-center justify-center gap-2"
            >
              {isCurrentlyGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t("generating")}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {t("generate")}
                </>
              )}
            </button>
          )}

          {/* Free tier usage counter — always visible so users know their remaining credits */}
          <p className="text-center text-sm text-zinc-400 mt-2">
            {t("usageLine", { used: todayUsageCount, limit: DAILY_FREE_GENERATION_LIMIT })}
            {todayUsageCount > 0 && todayUsageCount < DAILY_FREE_GENERATION_LIMIT && (
              <span className="text-zinc-500">
                {t("usageRemaining", { n: DAILY_FREE_GENERATION_LIMIT - todayUsageCount })}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* ================================================================
          RESULT DISPLAY AREA — Shows generated image or error

          This section only appears after the user has attempted generation.
          It's outside the form card but visually connected by proximity
          and consistent styling.

          THREE STATES:
          1. Nothing yet (initial) — hidden
          2. Error — red alert box with error message
          3. Success — generated image with download button
          ================================================================ */}

      {/* Error state — shows when the API returns an error or the request fails */}
      {generationError && (
        <div className="mt-6 rounded-2xl bg-red-500/10 border border-red-500/30 p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-400">
              {generationError.error}
            </p>
            <p className="text-sm text-red-400/70 mt-1">
              {generationError.message}
            </p>
          </div>
        </div>
      )}

      {/* Success state — shows the generated tattoo design */}
      {generationResult && (
        <div className="mt-6 rounded-2xl bg-card border border-border p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">{t("resultTitle")}</h3>
            {/* Download button — opens the image in a new tab for saving.
                Using target="_blank" because fal.ai CDN images can be
                saved directly. A more polished version would use a
                download attribute with a proper filename. */}
            <a
              href={generationResult.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              {t("download")}
            </a>
          </div>

          {/* Generated image display — uses next/image would be ideal for
              optimization, but using a standard img tag here because the
              image URL comes dynamically from fal.ai and we need it to
              work immediately without next.config.ts domain whitelisting
              complications during MVP. The image is displayed at full width
              within the card, maintaining its original aspect ratio. */}
          <div className="rounded-xl overflow-hidden bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={generationResult.imageUrl}
              alt={`AI-generated tattoo design: ${tattooDescriptionInput}`}
              className="w-full h-auto"
            />
          </div>

          {/* Prompt transparency — shows what was sent to the AI.
              This builds trust with users and helps them understand
              how to write better descriptions for future generations. */}
          <details className="mt-4">
            <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
              {t("viewPrompt")}
            </summary>
            <p className="text-xs text-muted-foreground/70 mt-2 p-3 rounded-lg bg-muted leading-relaxed">
              {generationResult.prompt}
            </p>
          </details>
        </div>
      )}
    </div>
  );
}
