/**
 * API ROUTE: POST /api/generate — Tattoo Design Generation Endpoint
 *
 * This is the core backend logic for the AI Tattoo Generator. It receives
 * a tattoo description, style, placement, and size from the client form,
 * constructs an optimized prompt for the AI model, and returns the generated
 * image URL.
 *
 * ARCHITECTURE DECISIONS:
 * - Uses fal.ai's FLUX model for image generation because it produces
 *   high-quality artistic images and has good prompt adherence for style control.
 * - The prompt engineering happens server-side (not client-side) to:
 *   1. Prevent users from seeing/manipulating our prompt templates
 *   2. Allow us to iterate on prompt quality without client updates
 *   3. Keep the fal.ai API key secure on the server
 * - Returns a direct image URL from fal.ai's CDN — no image proxying needed
 *   for MVP. In production we'd want to cache/proxy through our own CDN.
 *
 * RATE LIMITING (TODO):
 * Currently no rate limiting is implemented. Before launch, add:
 * - IP-based rate limiting (3 generations per day for free tier)
 * - API key authentication for Pro tier (unlimited)
 * - Consider using Upstash Redis for serverless-compatible rate limiting
 *
 * COST CONSIDERATIONS:
 * fal.ai FLUX generation costs ~$0.01-0.05 per image depending on resolution.
 * At 3 free generations per day per user, our costs are bounded. The $9.90/mo
 * Pro tier at unlimited usage needs monitoring — heavy users could cost $5-10/mo
 * in API calls, but most users generate 10-20 images/mo which is well within margin.
 *
 * CALLED BY: TattooGeneratorForm.tsx (client component via fetch POST)
 * DEPENDS ON: FAL_KEY environment variable, @fal-ai/client package
 */

import { NextRequest, NextResponse } from "next/server";
import { checkIpRateLimit, extractClientIpAddress } from "@/lib/server-ip-rate-limiter";

/**
 * TattooGenerationRequestBody — The shape of the POST request body.
 *
 * These fields map directly to the form inputs in TattooGeneratorForm.tsx.
 * The tattooDescription is free-form text from the user, while style,
 * placement, and size are constrained to predefined options.
 *
 * WHY these specific fields:
 * - tattooDescription: The creative input — what the user actually wants
 * - style: Critical for prompt engineering — each tattoo style has very
 *   different visual characteristics (e.g., "watercolor" vs "blackwork")
 * - placement: Affects composition — a wrist tattoo should be horizontal/small,
 *   a back piece can be complex and large
 * - size: Influences level of detail in the prompt — small tattoos need
 *   simpler designs, large ones can have more intricate details
 */
interface TattooGenerationRequestBody {
  tattooDescription: string;
  style: string;
  placement: string;
  size: string;
}

/**
 * constructTattooPromptFromUserInputs — Builds the AI prompt from form data.
 *
 * This is the "secret sauce" of the product. Good prompt engineering is what
 * separates a generic "text to image" tool from a specialized tattoo generator.
 * The prompt template adds tattoo-specific context that users shouldn't have
 * to think about — things like "clean lines", "white background", "tattoo flash
 * sheet style" that dramatically improve output quality.
 *
 * PROMPT STRATEGY:
 * 1. Start with the core tattoo context ("tattoo design")
 * 2. Add the user's creative description
 * 3. Layer in style-specific modifiers (each style has distinct visual language)
 * 4. Add composition hints based on placement and size
 * 5. End with quality/format directives (clean background, high detail)
 *
 * WHY "white background" in the prompt:
 * Tattoo flash sheets (the reference sheets tattoo artists use) are traditionally
 * on white paper. A clean white background makes the design easy to:
 * - Show to a tattoo artist as a reference
 * - Print as a stencil
 * - Overlay on body photos
 * - Use in social media posts
 *
 * CALLED BY: handlePostTattooGenerationRequest (below)
 * DEPENDS ON: Nothing external — pure function
 */
function constructTattooPromptFromUserInputs(
  tattooDescription: string,
  style: string,
  placement: string,
  size: string
): string {
  /**
   * Style-specific prompt modifiers — each tattoo style has distinct visual
   * characteristics that the AI model needs explicit guidance on. Without
   * these modifiers, the model tends to produce generic "illustration" style
   * output rather than style-authentic tattoo designs.
   *
   * These modifiers were developed through iterative testing with FLUX/SDXL
   * models. Key finding: being specific about line weight, shading technique,
   * and color palette produces dramatically better results than just naming
   * the style.
   */
  const styleSpecificPromptModifiers: Record<string, string> = {
    Traditional:
      "American traditional tattoo style, bold black outlines, limited color palette with red yellow green and blue, solid color fills, vintage sailor tattoo aesthetic",
    Watercolor:
      "watercolor tattoo style, soft color bleeds and splashes, minimal black outlines, painterly brushstroke effects, vibrant flowing colors",
    Geometric:
      "geometric tattoo style, precise mathematical patterns, clean straight lines, sacred geometry elements, symmetrical composition, fine line work",
    Japanese:
      "Japanese irezumi tattoo style, bold flowing composition, traditional Japanese motifs, wave patterns, cloud backgrounds, rich color saturation",
    Minimalist:
      "minimalist tattoo style, ultra-fine single needle lines, simple elegant design, minimal detail, clean and understated, delicate linework",
    Blackwork:
      "blackwork tattoo style, solid black ink only, bold graphic shapes, heavy black fills, high contrast, no color, ornamental patterns",
    Tribal:
      "tribal tattoo style, bold black curved lines, Polynesian and Maori inspired patterns, flowing organic shapes, symbolic abstract design",
    Realism:
      "photorealistic tattoo style, highly detailed shading, realistic depth and dimension, smooth gradients, lifelike rendering, fine detail work",
    "Neo-Traditional":
      "neo-traditional tattoo style, bold outlines with detailed shading, expanded color palette, art nouveau influences, decorative elements, modern twist on traditional",
    Dotwork:
      "dotwork tattoo style, stipple shading technique, intricate dot patterns, mandala elements, geometric precision, meditative repetitive patterns",
  };

  /**
   * Size-to-detail mapping — smaller tattoos need simpler compositions
   * while larger pieces can accommodate more complexity. This prevents
   * the AI from generating overly detailed designs for small placements
   * (which would look muddy when actually tattooed at small scale).
   */
  const sizeDetailGuidance: Record<string, string> = {
    Small: "simple composition with minimal detail, clean and readable at small scale",
    Medium: "moderate detail level, balanced composition, clear focal point",
    Large: "highly detailed composition, intricate elements, complex scene allowed",
  };

  /**
   * Assemble the final prompt from all components.
   * The ordering matters — models tend to weight earlier tokens more heavily,
   * so we put the most important context (tattoo design, user description)
   * first, and quality directives last.
   */
  const styleModifier = styleSpecificPromptModifiers[style] || style;
  const detailGuidance = sizeDetailGuidance[size] || "moderate detail";

  return `Professional tattoo design artwork: ${tattooDescription}. ${styleModifier}. Designed for ${placement.toLowerCase()} placement, ${size.toLowerCase()} size tattoo. ${detailGuidance}. Clean white background, tattoo flash sheet presentation, high quality detailed artwork, professional tattoo artist reference sheet.`;
}

/**
 * POST handler — Main entry point for tattoo generation requests.
 *
 * This function validates the request, checks for API credentials,
 * calls the fal.ai API, and returns the result. It follows the standard
 * Next.js App Router route handler pattern.
 *
 * ERROR HANDLING STRATEGY:
 * - Missing/invalid body: 400 with validation error
 * - Missing FAL_KEY: 503 with setup instructions (not 500, because it's a config issue)
 * - fal.ai API error: 500 with generic error (don't leak API details to client)
 * - Unexpected errors: 500 with generic message
 *
 * CALLED BY: Client-side fetch in TattooGeneratorForm.tsx
 */
export async function POST(request: NextRequest) {
  // ---------------------------------------------------------------------------
  // P0 HARDENING (2026-03-25): Server-side IP rate limit — MUST run before fal.ai call.
  // Without this, anyone with the endpoint URL can bypass the client-side localStorage
  // gate (DevTools, curl) and burn our FAL_KEY budget with unlimited free generations.
  // See: src/lib/server-ip-rate-limiter.ts for implementation details.
  // ---------------------------------------------------------------------------
  const _clientIp = extractClientIpAddress(request);
  const rateLimitCheckResult = await checkIpRateLimit(_clientIp);
  if (!rateLimitCheckResult.allowed) {
    return NextResponse.json(
      {
        error:
          "You have used your 5 free generations for today. Upgrade to Pro for unlimited access.",
        upgradeUrl: "/pricing",
      },
      { status: 429 }
    );
  }
  try {
    /**
     * Parse and validate the request body.
     * We check for all required fields upfront to provide clear error messages.
     * The client form should prevent most invalid requests, but API routes
     * must never trust client-side validation alone.
     */
    const body: TattooGenerationRequestBody = await request.json();

    const { tattooDescription, style, placement, size } = body;

    if (!tattooDescription || !style || !placement || !size) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          message:
            "Please provide tattooDescription, style, placement, and size.",
        },
        { status: 400 }
      );
    }

    if (tattooDescription.length < 3) {
      return NextResponse.json(
        {
          error: "Description too short",
          message:
            "Please provide a more detailed description of your tattoo idea (at least 3 characters).",
        },
        { status: 400 }
      );
    }

    if (tattooDescription.length > 1000) {
      return NextResponse.json(
        {
          error: "Description too long",
          message:
            "Please keep your tattoo description under 1000 characters.",
        },
        { status: 400 }
      );
    }

    /**
     * Check for fal.ai API key.
     *
     * If the key isn't set, return a helpful error message instead of
     * crashing. This is especially important during development and for
     * anyone who clones the repo — they need clear guidance on setup.
     *
     * We return 503 (Service Unavailable) rather than 500 (Internal Server Error)
     * because this is a configuration issue, not a code bug.
     */
    const falApiKey = process.env.FAL_KEY;

    if (!falApiKey) {
      return NextResponse.json(
        {
          error: "FAL_KEY not configured",
          message:
            "The AI generation service is not configured. Set FAL_KEY in your .env.local file to enable tattoo generation. Get your key at https://fal.ai/dashboard/keys",
        },
        { status: 503 }
      );
    }

    /**
     * Construct the optimized prompt from user inputs.
     * See constructTattooPromptFromUserInputs for the prompt engineering strategy.
     */
    const constructedPrompt = constructTattooPromptFromUserInputs(
      tattooDescription,
      style,
      placement,
      size
    );

    /**
     * Call fal.ai FLUX model for image generation.
     *
     * We use the @fal-ai/client package which handles authentication,
     * retries, and polling for async generation jobs automatically.
     *
     * MODEL CHOICE: fal-ai/flux/dev
     * - Good balance of quality and speed (~5-15 seconds)
     * - Excellent prompt adherence for artistic styles
     * - Cost-effective at ~$0.01-0.03 per generation
     * - Produces clean, high-resolution output
     *
     * IMAGE SIZE: square (1024x1024)
     * - Square format works best for tattoo flash sheets
     * - Standard size for social media sharing
     * - Can be cropped for different aspect ratios on the client
     *
     * We dynamically import fal to avoid loading the SDK on routes
     * that don't need it (tree-shaking optimization).
     */
    const { fal } = await import("@fal-ai/client");

    fal.config({
      credentials: falApiKey,
    });

    const generationResult = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt: constructedPrompt,
        image_size: "square_hd",
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        enable_safety_checker: true,
      },
    });

    /**
     * Extract the generated image URL from the fal.ai response.
     *
     * The response structure is: { data: { images: [{ url, width, height }] } }
     * We check for the presence of images defensively — if the safety checker
     * blocked the generation, the images array might be empty.
     */
    const generatedImages = generationResult?.data?.images;

    if (!generatedImages || generatedImages.length === 0) {
      return NextResponse.json(
        {
          error: "Generation failed",
          message:
            "The AI could not generate an image for this description. This may be due to content safety filters. Try rephrasing your description.",
        },
        { status: 422 }
      );
    }

    /**
     * Return the generated image URL to the client.
     * We include the prompt for transparency — users can see exactly
     * what was sent to the AI, which builds trust and helps them
     * understand how to write better descriptions.
     */
    return NextResponse.json({
      imageUrl: generatedImages[0].url,
      prompt: constructedPrompt,
      width: generatedImages[0].width,
      height: generatedImages[0].height,
    });
  } catch (error) {
    /**
     * Catch-all error handler.
     * Log the full error server-side for debugging, but return a
     * generic message to the client to avoid leaking internal details.
     */
    console.error("Tattoo generation error:", error);

    return NextResponse.json(
      {
        error: "Generation failed",
        message:
          "Something went wrong while generating your tattoo design. Please try again.",
      },
      { status: 500 }
    );
  }
}
