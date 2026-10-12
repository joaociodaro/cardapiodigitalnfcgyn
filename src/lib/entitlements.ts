/**
 * Direitos de uso de um estabelecimento, calculados a partir das licenças.
 * Função pura: o servidor busca as licenças (RLS) e chama computeEntitlements.
 * Nenhum recurso pago é liberado com base no navegador.
 */

export interface PlanFeatures {
  whatsapp_orders?: boolean;
  analytics?: boolean;
  reports?: boolean;
  advanced_layout?: boolean;
  qr_styling?: boolean;
  priority_support?: boolean;
}

export interface LicenseInput {
  status: "active" | "expired" | "revoked";
  source: "purchase" | "subscription" | "admin_grant";
  starts_at: string;
  hosting_until: string | null;
  limits_override: Record<string, unknown> | null;
  plan: {
    code: string;
    name: string;
    sort_order: number;
    max_published_menus: number;
    template_tier: "essential" | "premium";
    max_essential_templates: number | null;
    features: PlanFeatures;
  };
  subscription: {
    status: "pending" | "active" | "past_due" | "suspended" | "canceled" | "expired";
    grace_until: string | null;
    current_period_end: string | null;
  } | null;
}

export interface Entitlements {
  active: boolean;
  planCode: string | null;
  planName: string | null;
  source: LicenseInput["source"] | null;
  /** Fim da hospedagem incluída (pagamento único) ou do período atual (assinatura). */
  validUntil: string | null;
  inGracePeriod: boolean;
  maxPublishedMenus: number;
  templateTier: "essential" | "premium" | null;
  maxEssentialTemplates: number | null;
  features: Required<PlanFeatures>;
}

const NO_FEATURES: Required<PlanFeatures> = {
  whatsapp_orders: false,
  analytics: false,
  reports: false,
  advanced_layout: false,
  qr_styling: false,
  priority_support: false,
};

export const NO_ENTITLEMENTS: Entitlements = {
  active: false,
  planCode: null,
  planName: null,
  source: null,
  validUntil: null,
  inGracePeriod: false,
  maxPublishedMenus: 0,
  templateTier: null,
  maxEssentialTemplates: null,
  features: NO_FEATURES,
};

function licenseState(l: LicenseInput, now: Date): { valid: boolean; grace: boolean; until: string | null } {
  if (l.status !== "active" || new Date(l.starts_at) > now) return { valid: false, grace: false, until: null };
  if (l.source === "subscription") {
    const s = l.subscription;
    if (!s) return { valid: false, grace: false, until: null };
    if (s.status === "active") return { valid: true, grace: false, until: s.current_period_end };
    if (s.status === "past_due" && s.grace_until && new Date(s.grace_until) >= now) return { valid: true, grace: true, until: s.grace_until };
    return { valid: false, grace: false, until: null };
  }
  if (l.hosting_until && new Date(l.hosting_until) < now) return { valid: false, grace: false, until: l.hosting_until };
  return { valid: true, grace: false, until: l.hosting_until };
}

export function computeEntitlements(licenses: LicenseInput[], now = new Date()): Entitlements {
  const valid = licenses
    .map((l) => ({ l, s: licenseState(l, now) }))
    .filter((x) => x.s.valid)
    .sort((a, b) => b.l.plan.sort_order - a.l.plan.sort_order);

  const best = valid[0];
  if (!best) return NO_ENTITLEMENTS;

  const o = (best.l.limits_override ?? {}) as Partial<{ max_published_menus: number; features: PlanFeatures }>;
  return {
    active: true,
    planCode: best.l.plan.code,
    planName: best.l.plan.name,
    source: best.l.source,
    validUntil: best.s.until,
    inGracePeriod: best.s.grace,
    maxPublishedMenus: o.max_published_menus ?? best.l.plan.max_published_menus,
    templateTier: best.l.plan.template_tier,
    maxEssentialTemplates: best.l.plan.max_essential_templates,
    features: { ...NO_FEATURES, ...best.l.plan.features, ...(o.features ?? {}) },
  };
}

/** O modelo está liberado para estes direitos? */
export function canUseTemplate(e: Entitlements, tier: "essential" | "premium"): boolean {
  if (!e.active) return false;
  return e.templateTier === "premium" || tier === "essential";
}
