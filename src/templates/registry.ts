import type { ComponentType } from "react";
import type { TemplateProps } from "@/menu-engine/types";
import type { TemplateDefinition } from "./types";

import { royalGold } from "./royal-gold/definition";
import { pureMinimal } from "./pure-minimal/definition";
import { urbanBlack } from "./urban-black/definition";
import { tokyoSignature } from "./tokyo-signature/definition";
import { velvetLounge } from "./velvet-lounge/definition";
import { coffeeAtelier } from "./coffee-atelier/definition";
import { italianHeritage } from "./italian-heritage/definition";
import { primeSteakhouse } from "./prime-steakhouse/definition";
import { sweetBoutique } from "./sweet-boutique/definition";
import { oceanSignature } from "./ocean-signature/definition";

import RoyalGold from "./royal-gold/Template";
import PureMinimal from "./pure-minimal/Template";
import UrbanBlack from "./urban-black/Template";
import TokyoSignature from "./tokyo-signature/Template";
import VelvetLounge from "./velvet-lounge/Template";
import CoffeeAtelier from "./coffee-atelier/Template";
import ItalianHeritage from "./italian-heritage/Template";
import PrimeSteakhouse from "./prime-steakhouse/Template";
import SweetBoutique from "./sweet-boutique/Template";
import OceanSignature from "./ocean-signature/Template";

/**
 * Registro central dos modelos.
 *
 * O layout de cada modelo vive no código (componentes React). Os metadados
 * comerciais — ativo, ordem, planos com acesso, imagem de vitrine — são
 * espelhados na tabela menu_templates e controlados pelo painel administrativo.
 */
export const TEMPLATES: TemplateDefinition[] = [
  royalGold,
  pureMinimal,
  urbanBlack,
  tokyoSignature,
  velvetLounge,
  coffeeAtelier,
  italianHeritage,
  primeSteakhouse,
  sweetBoutique,
  oceanSignature,
];

const COMPONENTS: Record<string, ComponentType<TemplateProps>> = {
  "royal-gold": RoyalGold,
  "pure-minimal": PureMinimal,
  "urban-black": UrbanBlack,
  "tokyo-signature": TokyoSignature,
  "velvet-lounge": VelvetLounge,
  "coffee-atelier": CoffeeAtelier,
  "italian-heritage": ItalianHeritage,
  "prime-steakhouse": PrimeSteakhouse,
  "sweet-boutique": SweetBoutique,
  "ocean-signature": OceanSignature,
};

export function getTemplate(slug: string): TemplateDefinition | undefined {
  return TEMPLATES.find((t) => t.meta.slug === slug);
}

export function getTemplateComponent(slug: string): ComponentType<TemplateProps> {
  const C = COMPONENTS[slug];
  if (!C) throw new Error(`Modelo desconhecido: ${slug}`);
  return C;
}
