export interface FontOption {
  id: string;
  label: string;
  stack: string;
  kind: "serif" | "sans" | "display" | "script";
}

export const FONT_OPTIONS: FontOption[] = [
  { id: "cinzel", label: "Cinzel", stack: "'Cinzel', Georgia, serif", kind: "display" },
  { id: "cormorant", label: "Cormorant Garamond", stack: "'Cormorant Garamond', Georgia, serif", kind: "serif" },
  { id: "playfair", label: "Playfair Display", stack: "'Playfair Display', Georgia, serif", kind: "serif" },
  { id: "bodoni", label: "Bodoni Moda", stack: "'Bodoni Moda', Didot, serif", kind: "serif" },
  { id: "italiana", label: "Italiana", stack: "'Italiana', Didot, serif", kind: "display" },
  { id: "fraunces", label: "Fraunces", stack: "'Fraunces', Georgia, serif", kind: "serif" },
  { id: "baskerville", label: "Libre Baskerville", stack: "'Libre Baskerville', Georgia, serif", kind: "serif" },
  { id: "dm-serif", label: "DM Serif Display", stack: "'DM Serif Display', Georgia, serif", kind: "serif" },
  { id: "bebas", label: "Bebas Neue", stack: "'Bebas Neue', Impact, sans-serif", kind: "display" },
  { id: "oswald", label: "Oswald", stack: "'Oswald', 'Arial Narrow', sans-serif", kind: "display" },
  { id: "manrope", label: "Manrope", stack: "'Manrope', system-ui, sans-serif", kind: "sans" },
  { id: "inter", label: "Inter", stack: "'Inter', system-ui, sans-serif", kind: "sans" },
  { id: "jost", label: "Jost", stack: "'Jost', system-ui, sans-serif", kind: "sans" },
  { id: "nunito", label: "Nunito", stack: "'Nunito', system-ui, sans-serif", kind: "sans" },
  { id: "lato", label: "Lato", stack: "'Lato', system-ui, sans-serif", kind: "sans" },
  { id: "barlow", label: "Barlow", stack: "'Barlow', system-ui, sans-serif", kind: "sans" },
  { id: "quicksand", label: "Quicksand", stack: "'Quicksand', system-ui, sans-serif", kind: "sans" },
  { id: "dm-sans", label: "DM Sans", stack: "'DM Sans', system-ui, sans-serif", kind: "sans" },
  { id: "montserrat", label: "Montserrat", stack: "'Montserrat', system-ui, sans-serif", kind: "sans" },
  { id: "parisienne", label: "Parisienne", stack: "'Parisienne', cursive", kind: "script" },
];

/** Combinações profissionais sugeridas no editor. */
export const FONT_PAIRINGS: Array<{ label: string; heading: string; body: string }> = [
  { label: "Clássico luxuoso", heading: "cinzel", body: "cormorant" },
  { label: "Editorial", heading: "playfair", body: "lato" },
  { label: "Minimalista", heading: "manrope", body: "manrope" },
  { label: "Urbano", heading: "bebas", body: "inter" },
  { label: "Artesanal", heading: "fraunces", body: "nunito" },
  { label: "Coquetelaria", heading: "italiana", body: "bodoni" },
  { label: "Robusto", heading: "oswald", body: "barlow" },
  { label: "Delicado", heading: "parisienne", body: "quicksand" },
  { label: "Litorâneo", heading: "dm-serif", body: "dm-sans" },
];

const byId = new Map(FONT_OPTIONS.map((f) => [f.id, f]));

export function fontStack(id: string): string {
  return byId.get(id)?.stack ?? "system-ui, sans-serif";
}
