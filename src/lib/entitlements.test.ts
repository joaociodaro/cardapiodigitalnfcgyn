import { describe, expect, it } from "vitest";
import { canUseTemplate, computeEntitlements, type LicenseInput } from "./entitlements";

const now = new Date("2026-10-11T12:00:00Z");
const essencial: LicenseInput["plan"] = {
  code: "essencial", name: "Essencial", sort_order: 0, max_published_menus: 1, template_tier: "essential", max_essential_templates: 3,
  features: { whatsapp_orders: false },
};
const business: LicenseInput["plan"] = {
  code: "business", name: "Business", sort_order: 2, max_published_menus: 3, template_tier: "premium", max_essential_templates: null,
  features: { whatsapp_orders: true, analytics: true, reports: true },
};

const purchase = (plan: LicenseInput["plan"], until: string | null, extra: Partial<LicenseInput> = {}): LicenseInput => ({
  status: "active", source: "purchase", starts_at: "2026-01-01T00:00:00Z", hosting_until: until, limits_override: null, plan, subscription: null, ...extra,
});

describe("direitos de uso", () => {
  it("sem licença, nada é liberado", () => {
    const e = computeEntitlements([], now);
    expect(e.active).toBe(false);
    expect(e.maxPublishedMenus).toBe(0);
    expect(canUseTemplate(e, "essential")).toBe(false);
  });

  it("pagamento único vale até o fim da hospedagem incluída", () => {
    expect(computeEntitlements([purchase(essencial, "2027-01-01T00:00:00Z")], now).active).toBe(true);
    expect(computeEntitlements([purchase(essencial, "2026-10-01T00:00:00Z")], now).active).toBe(false);
  });

  it("licença revogada ou futura não vale", () => {
    expect(computeEntitlements([purchase(essencial, null, { status: "revoked" })], now).active).toBe(false);
    expect(computeEntitlements([purchase(essencial, null, { starts_at: "2027-01-01T00:00:00Z" })], now).active).toBe(false);
  });

  it("assinatura inadimplente vale só dentro da tolerância", () => {
    const sub = (status: "active" | "past_due" | "canceled", grace: string | null): LicenseInput => ({
      ...purchase(business, null), source: "subscription",
      subscription: { status, grace_until: grace, current_period_end: "2026-11-01T00:00:00Z" },
    });
    expect(computeEntitlements([sub("active", null)], now).active).toBe(true);
    const g = computeEntitlements([sub("past_due", "2026-10-15T00:00:00Z")], now);
    expect(g.active && g.inGracePeriod).toBe(true);
    expect(computeEntitlements([sub("past_due", "2026-10-10T00:00:00Z")], now).active).toBe(false);
    expect(computeEntitlements([sub("canceled", null)], now).active).toBe(false);
  });

  it("escolhe o melhor plano entre licenças válidas e aplica ajustes do admin", () => {
    const e = computeEntitlements(
      [purchase(essencial, null), purchase(business, null, { limits_override: { max_published_menus: 5 } })],
      now,
    );
    expect(e.planCode).toBe("business");
    expect(e.maxPublishedMenus).toBe(5);
    expect(e.features.reports).toBe(true);
    expect(canUseTemplate(e, "premium")).toBe(true);
  });

  it("Essencial não libera modelos premium", () => {
    const e = computeEntitlements([purchase(essencial, null)], now);
    expect(canUseTemplate(e, "essential")).toBe(true);
    expect(canUseTemplate(e, "premium")).toBe(false);
  });
});
