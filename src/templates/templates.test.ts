import { describe, expect, it } from "vitest";
import { TEMPLATES, getTemplateComponent } from "./registry";
import { FONT_OPTIONS } from "@/menu-engine/fonts";

const HEX = /^#[0-9a-f]{6}$/i;
const fontIds = new Set(FONT_OPTIONS.map((f) => f.id));

describe("biblioteca de modelos", () => {
  it("tem 10 modelos com identificadores exclusivos", () => {
    expect(TEMPLATES).toHaveLength(10);
    const slugs = TEMPLATES.map((t) => t.meta.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("tem pelo menos 3 modelos disponíveis no plano Essencial", () => {
    expect(TEMPLATES.filter((t) => t.meta.tier === "essential").length).toBeGreaterThanOrEqual(3);
  });

  for (const t of TEMPLATES) {
    describe(t.meta.name, () => {
      it("possui componente de layout próprio", () => {
        expect(getTemplateComponent(t.meta.slug)).toBeTypeOf("function");
      });

      it("tem ao menos 5 categorias, cada uma com produtos", () => {
        expect(t.demo.categories.length).toBeGreaterThanOrEqual(5);
        for (const c of t.demo.categories) expect(c.products.length).toBeGreaterThan(0);
      });

      it("tem produtos completos (nome, descrição, preço) e com imagens", () => {
        const products = t.demo.categories.flatMap((c) => c.products);
        for (const p of products) {
          expect(p.name.length).toBeGreaterThan(1);
          expect(p.description?.length ?? 0).toBeGreaterThan(2);
          expect(Number.isInteger(p.priceCents)).toBe(true);
          expect(p.priceCents).toBeGreaterThan(0);
        }
        const withImages = products.filter((p) => p.imageUrl).length;
        expect(withImages / products.length).toBeGreaterThanOrEqual(0.6);
      });

      it("não repete ids de categorias nem de produtos", () => {
        const cats = t.demo.categories.map((c) => c.id);
        expect(new Set(cats).size).toBe(cats.length);
        const prods = t.demo.categories.flatMap((c) => c.products.map((p) => p.id));
        expect(new Set(prods).size).toBe(prods.length);
      });

      it("tem tema válido (cores hex, fontes registradas, layout suportado)", () => {
        for (const v of Object.values(t.theme.colors)) expect(v).toMatch(HEX);
        expect(fontIds.has(t.theme.fonts.heading)).toBe(true);
        expect(fontIds.has(t.theme.fonts.body)).toBe(true);
        expect(t.meta.capabilities.productViews).toContain(t.theme.layout.productView);
        expect(t.meta.capabilities.headerStyles).toContain(t.theme.layout.headerStyle);
      });

      it("é marcado como demonstração (não envia mensagens a números fictícios)", () => {
        expect(t.demo.settings.demo).toBe(true);
      });
    });
  }
});
