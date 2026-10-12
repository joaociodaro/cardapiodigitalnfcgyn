/**
 * Gera supabase/seed.sql a partir das definições em código (planos e modelos),
 * mantendo uma única fonte de verdade.  Uso: npm run db:seed
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { TEMPLATES } from "../src/templates/registry";
import { PLANS } from "../src/config/plans";

const q = (v: string) => `'${v.replace(/'/g, "''")}'`;
const j = (v: unknown) => `${q(JSON.stringify(v))}::jsonb`;

const out: string[] = [];
out.push("-- Gerado por scripts/generate-seed.ts — não editar manualmente.");
out.push("");
out.push("insert into public.roles (code, description) values");
out.push("  ('platform_admin', 'Proprietário/administrador da plataforma'),");
out.push("  ('support', 'Equipe de suporte (somente leitura de clientes)')");
out.push("on conflict (code) do nothing;");
out.push("");

const perms = [
  ["clients.read", "Ver clientes"],
  ["clients.manage", "Bloquear/reativar clientes"],
  ["licenses.manage", "Atribuir e revogar licenças"],
  ["plans.manage", "Criar e editar planos e cupons"],
  ["templates.manage", "Gerenciar modelos"],
  ["payments.read", "Ver pagamentos e relatórios financeiros"],
  ["menus.manage_any", "Criar e editar cardápios de qualquer cliente"],
  ["settings.manage", "Alterar configurações da plataforma"],
];
out.push("insert into public.permissions (code, description) values");
out.push(perms.map(([c, d]) => `  (${q(c)}, ${q(d)})`).join(",\n"));
out.push("on conflict (code) do nothing;");
out.push("");
out.push("insert into public.role_permissions (role_id, permission_id)");
out.push("select r.id, p.id from public.roles r cross join public.permissions p where r.code = 'platform_admin'");
out.push("on conflict do nothing;");
out.push("insert into public.role_permissions (role_id, permission_id)");
out.push("select r.id, p.id from public.roles r join public.permissions p on p.code in ('clients.read', 'payments.read') where r.code = 'support'");
out.push("on conflict do nothing;");
out.push("");

out.push("insert into public.plans (code, name, description, monthly_price_cents, one_time_price_cents, one_time_hosting_months, hosting_renewal_price_cents, max_published_menus, template_tier, max_essential_templates, features, sort_order) values");
out.push(
  PLANS.map((p, i) => {
    const features = {
      whatsapp_orders: p.code !== "essencial",
      analytics: p.code !== "essencial",
      reports: p.code === "business",
      advanced_layout: p.code !== "essencial",
      qr_styling: p.code !== "essencial",
      priority_support: p.code !== "essencial",
    };
    return `  (${q(p.code)}, ${q(p.name)}, ${q(p.pitch)}, ${p.monthlyCents}, ${p.oneTimeCents}, ${p.oneTimeHostingMonths}, ${p.hostingRenewalCents}, ${p.publishedMenus}, ${q(p.templates === "all" ? "premium" : "essential")}, ${p.templates === "all" ? "null" : 3}, ${j(features)}, ${i})`;
  }).join(",\n"),
);
out.push("on conflict (code) do nothing;");
out.push("");

out.push("insert into public.menu_templates (slug, name, segment, description, preview_image_url, tier, version, default_theme, demo_document, sort_order) values");
out.push(
  TEMPLATES.map(
    (t, i) =>
      `  (${q(t.meta.slug)}, ${q(t.meta.name)}, ${q(t.meta.segment)}, ${q(t.meta.description)}, ${q(t.meta.previewImage)}, ${q(t.meta.tier)}, ${t.meta.version}, ${j(t.theme)}, ${j(t.demo)}, ${i})`,
  ).join(",\n"),
);
out.push("on conflict (slug) do update set");
out.push("  name = excluded.name, segment = excluded.segment, description = excluded.description,");
out.push("  version = excluded.version, default_theme = excluded.default_theme, demo_document = excluded.demo_document;");
out.push("");
out.push("insert into public.platform_settings (key, value) values");
out.push(`  ('billing', ${j({ grace_days: 7, suspend_after_days: 7, delete_data: false })})`);
out.push("on conflict (key) do nothing;");

writeFileSync(join(__dirname, "..", "supabase", "seed.sql"), out.join("\n") + "\n");
console.log(`seed.sql gerado: ${PLANS.length} planos, ${TEMPLATES.length} modelos`);
