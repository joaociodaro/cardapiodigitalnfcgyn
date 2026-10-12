import "./fonts.css";
import "./runtime/menu.css";
import type { MenuDocument, ThemeConfig } from "./types";
import { themeToStyle } from "./theme";
import { getTemplateComponent } from "@/templates/registry";
import { MenuProvider } from "./runtime/MenuContext";
import { MenuOverlays } from "./runtime/Overlays";

/**
 * Renderiza qualquer cardápio: demonstrações, cardápios publicados e a prévia do editor.
 * O mesmo componente é usado em todos os lugares, garantindo que a prévia seja fiel.
 */
export function MenuRenderer({
  templateSlug,
  doc,
  theme,
  className,
}: {
  templateSlug: string;
  doc: MenuDocument;
  theme: ThemeConfig;
  className?: string;
}) {
  const Template = getTemplateComponent(templateSlug);
  return (
    <div
      className={`menu-root ${className ?? ""}`}
      style={themeToStyle(theme)}
      data-template={templateSlug}
      data-button={theme.layout.buttonStyle}
    >
      <MenuProvider doc={doc}>
        <Template doc={doc} theme={theme} />
        <MenuOverlays />
      </MenuProvider>
    </div>
  );
}
