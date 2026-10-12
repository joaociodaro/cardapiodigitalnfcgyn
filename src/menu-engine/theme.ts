import type { CSSProperties } from "react";
import type { ThemeConfig } from "./types";
import { fontStack } from "./fonts";

const SPACING = { compact: 0.75, normal: 1, airy: 1.35 } as const;

/**
 * Converte o tema em variáveis CSS aplicadas na raiz do cardápio.
 * Todos os modelos leem cores, fontes e medidas dessas variáveis — é isso
 * que faz a personalização do editor aparecer imediatamente na prévia.
 */
export function themeToStyle(theme: ThemeConfig): CSSProperties {
  const { colors: c, fonts: f, layout: l } = theme;
  return {
    "--m-primary": c.primary,
    "--m-secondary": c.secondary,
    "--m-bg": c.background,
    "--m-text": c.text,
    "--m-heading": c.heading,
    "--m-button": c.button,
    "--m-button-text": c.buttonText,
    "--m-border": c.border,
    "--m-card": c.card,
    "--m-highlight": c.highlight,
    "--m-header": c.header,
    "--m-footer": c.footer,
    "--m-font-heading": fontStack(f.heading),
    "--m-font-body": fontStack(f.body),
    "--m-heading-scale": String(f.headingScale),
    "--m-body-scale": String(f.bodyScale),
    "--m-heading-weight": String(f.headingWeight),
    "--m-tracking": `${f.letterSpacing}em`,
    "--m-radius": `${l.radius}px`,
    "--m-space": String(SPACING[l.spacing]),
    backgroundColor: c.background,
    color: c.text,
    fontFamily: fontStack(f.body),
  } as CSSProperties;
}

/** Mescla parcial de tema (usado pelo editor e ao restaurar padrões). */
export function mergeTheme(base: ThemeConfig, patch?: Partial<{
  colors: Partial<ThemeConfig["colors"]>;
  fonts: Partial<ThemeConfig["fonts"]>;
  layout: Partial<ThemeConfig["layout"]>;
}>): ThemeConfig {
  if (!patch) return base;
  return {
    colors: { ...base.colors, ...patch.colors },
    fonts: { ...base.fonts, ...patch.fonts },
    layout: { ...base.layout, ...patch.layout },
  };
}
