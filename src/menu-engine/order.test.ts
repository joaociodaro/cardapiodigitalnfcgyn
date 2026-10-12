import { describe, expect, it } from "vitest";
import { buildOrderMessage, cartTotal, lineKey, unitPrice, whatsappLink, type CartLine } from "./order";
import { basePrice, formatPrice, hasPromo, normalize } from "./format";
import type { Product } from "./types";

const burger: Product = {
  id: "classic",
  name: "Classic",
  priceCents: 3400,
  addons: [
    { id: "bacon", name: "Bacon", priceCents: 600 },
    { id: "ovo", name: "Ovo", priceCents: 400 },
  ],
};
const fries: Product = {
  id: "fritas",
  name: "Fritas",
  priceCents: 1600,
  variations: [
    { id: "m", name: "Média", priceCents: 1600 },
    { id: "g", name: "Grande", priceCents: 2400 },
  ],
};

describe("preços", () => {
  it("formata em reais", () => {
    expect(formatPrice(3490).replace(/\s/g, " ")).toBe("R$ 34,90");
  });
  it("usa a menor variação como preço base", () => {
    expect(basePrice(fries)).toBe(1600);
  });
  it("respeita preço promocional apenas quando menor", () => {
    expect(hasPromo({ ...burger, promoPriceCents: 2990 })).toBe(true);
    expect(hasPromo({ ...burger, promoPriceCents: 3990 })).toBe(false);
  });
  it("soma adicionais e usa variação", () => {
    expect(unitPrice({ product: burger, addons: burger.addons! })).toBe(4400);
    expect(unitPrice({ product: fries, variation: fries.variations![1], addons: [] })).toBe(2400);
    expect(unitPrice({ product: { ...burger, promoPriceCents: 3000 }, addons: [] })).toBe(3000);
  });
});

describe("pedido pelo WhatsApp", () => {
  const lines: CartLine[] = [
    { key: "a", product: burger, addons: [burger.addons![0]], quantity: 2, note: "sem cebola" },
    { key: "b", product: fries, variation: fries.variations![1], addons: [], quantity: 1 },
  ];

  it("calcula o total", () => {
    expect(cartTotal(lines)).toBe((3400 + 600) * 2 + 2400);
  });

  it("monta a mensagem com itens, adicionais, observações e total", () => {
    const msg = buildOrderMessage({ establishmentName: "Brasa", lines, customerName: "Ana", generalNote: "Mesa 4" });
    expect(msg).toContain("Novo pedido — Brasa");
    expect(msg).toContain("Cliente: Ana");
    expect(msg).toContain("2x Classic");
    expect(msg).toContain("+ Bacon");
    expect(msg).toContain("Obs.: sem cebola");
    expect(msg).toContain("1x Fritas (Grande)");
    expect(msg).toMatch(/Total estimado: R\$\s104,00/);
    expect(msg).toContain("Observações: Mesa 4");
  });

  it("gera chave igual para o mesmo item, independente da ordem dos adicionais", () => {
    expect(lineKey("x", undefined, ["b", "a"])).toBe(lineKey("x", undefined, ["a", "b"]));
    expect(lineKey("x", undefined, ["a"], "sem sal")).not.toBe(lineKey("x", undefined, ["a"]));
  });

  it("gera link wa.me só com dígitos e texto codificado", () => {
    expect(whatsappLink("+55 (62) 99999-0000", "Olá & tchau")).toBe("https://wa.me/5562999990000?text=Ol%C3%A1%20%26%20tchau");
  });
});

describe("busca", () => {
  it("ignora acentos e caixa", () => {
    expect(normalize("Pão de Açúcar")).toBe("pao de acucar");
  });
});
