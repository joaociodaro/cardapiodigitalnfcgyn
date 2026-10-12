import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { TEMPLATES } from "@/templates/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/como-funciona", "/modelos", "/planos", "/perguntas-frequentes", "/contato", "/termos", "/privacidade"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...TEMPLATES.map((t) => ({ url: `${site.url}/modelos/${t.meta.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
