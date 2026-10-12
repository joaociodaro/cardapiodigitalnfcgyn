import type { MenuDocument, TemplateMeta, ThemeConfig } from "@/menu-engine/types";

export interface TemplateDefinition {
  meta: TemplateMeta;
  /** Tema original do modelo — usado em "Restaurar cores originais". */
  theme: ThemeConfig;
  /** Cardápio demonstrativo, copiado para a conta do cliente ao usar o modelo. */
  demo: MenuDocument;
}
