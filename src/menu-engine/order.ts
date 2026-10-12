import { formatPrice } from "./format";
import type { Product, ProductOption } from "./types";

export interface CartLine {
  key: string;
  product: Product;
  variation?: ProductOption;
  addons: ProductOption[];
  quantity: number;
  note?: string;
}

export function unitPrice(line: Pick<CartLine, "product" | "variation" | "addons">): number {
  const base = line.variation
    ? line.variation.priceCents
    : line.product.promoPriceCents ?? line.product.priceCents;
  return base + line.addons.reduce((s, a) => s + a.priceCents, 0);
}

export function lineTotal(line: CartLine): number {
  return unitPrice(line) * line.quantity;
}

export function cartTotal(lines: CartLine[]): number {
  return lines.reduce((s, l) => s + lineTotal(l), 0);
}

export function lineKey(productId: string, variationId: string | undefined, addonIds: string[], note?: string) {
  return [productId, variationId ?? "-", [...addonIds].sort().join(","), note?.trim() ?? ""].join("|");
}

/** Monta a mensagem de pedido enviada ao WhatsApp do estabelecimento. */
export function buildOrderMessage(params: {
  establishmentName: string;
  lines: CartLine[];
  customerName?: string;
  generalNote?: string;
}): string {
  const { establishmentName, lines, customerName, generalNote } = params;
  const out: string[] = [];
  out.push(`*Novo pedido — ${establishmentName}*`);
  if (customerName?.trim()) out.push(`Cliente: ${customerName.trim()}`);
  out.push("");
  for (const l of lines) {
    const name = l.variation ? `${l.product.name} (${l.variation.name})` : l.product.name;
    out.push(`${l.quantity}x ${name} — ${formatPrice(lineTotal(l))}`);
    for (const a of l.addons) out.push(`   + ${a.name}`);
    if (l.note?.trim()) out.push(`   Obs.: ${l.note.trim()}`);
  }
  out.push("");
  out.push(`*Total estimado: ${formatPrice(cartTotal(lines))}*`);
  if (generalNote?.trim()) {
    out.push("");
    out.push(`Observações: ${generalNote.trim()}`);
  }
  out.push("");
  out.push("_Valores sujeitos à confirmação do estabelecimento._");
  return out.join("\n");
}

export function whatsappLink(phoneDigits: string, text?: string): string {
  const phone = phoneDigits.replace(/\D/g, "");
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${phone}${q}`;
}
