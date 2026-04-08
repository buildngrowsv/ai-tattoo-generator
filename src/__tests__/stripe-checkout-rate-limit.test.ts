import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { mockCheckServerSideRateLimitWithConfig } = vi.hoisted(() => ({
  mockCheckServerSideRateLimitWithConfig: vi.fn(),
}));

vi.mock("@/lib/server-ip-rate-limiter", () => ({
  checkServerSideRateLimitWithConfig: mockCheckServerSideRateLimitWithConfig,
}));

vi.mock("@/lib/subscription-store", () => ({
  createPendingToken: vi.fn(async () => "token_test_pending"),
}));

import { POST } from "@/app/api/stripe/checkout/route";

function buildRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/stripe/checkout — durable rate limiting", () => {
  beforeEach(() => {
    mockCheckServerSideRateLimitWithConfig.mockReset();
    mockCheckServerSideRateLimitWithConfig.mockResolvedValue({
      allowed: true,
      retryAfter: 0,
    });
    delete process.env.STRIPE_SECRET_KEY;
  });

  it("returns 429 with Retry-After when checkout abuse is rate limited", async () => {
    mockCheckServerSideRateLimitWithConfig.mockResolvedValue({
      allowed: false,
      retryAfter: 3600,
    });

    const response = await POST(buildRequest({ priceId: "price_test_123" }));
    const json = await response.json();

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("3600");
    expect(json.error).toContain("Too many checkout requests");
    expect(mockCheckServerSideRateLimitWithConfig).toHaveBeenCalledTimes(1);
  });

  it("still returns 503 for missing Stripe config once the request is allowed", async () => {
    const response = await POST(buildRequest({ priceId: "price_test_123" }));
    const json = await response.json();

    expect(response.status).toBe(503);
    expect(json.error).toContain("Payment system not configured");
    expect(mockCheckServerSideRateLimitWithConfig).toHaveBeenCalledTimes(1);
  });
});
