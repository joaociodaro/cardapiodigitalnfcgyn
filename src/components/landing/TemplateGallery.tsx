"use client";

import { useState } from "react";
import clsx from "clsx";
import type { TemplateDefinition } from "@/templates/types";
import { TemplateCard } from "./TemplateCard";

const FILTERS = [
  { id: "todos", label: "Todos", match: () => true },
  { id: "restaurantes", label: "Restaurantes", match: (s: string) => /restaurante|steak|churrasc|italian|frutos/i.test(s) },
  { id: "cafes", label: "Cafés e doces", match: (s: string) => /cafeter|confeit|doce|bistr/i.test(s) },
  { id: "bares", label: "Bares e lanches", match: (s: string) => /bar|hamburg/i.test(s) },
];

export function TemplateGallery({ templates }: { templates: Array<Pick<TemplateDefinition, "meta" | "theme">> }) {
  const [filter, setFilter] = useState("todos");
  const f = FILTERS.find((x) => x.id === filter)!;
  const list = templates.filter((t) => f.match(t.meta.segment));

  return (
    <div>
      <div role="radiogroup" aria-label="Filtrar por segmento" className="flex flex-wrap gap-2">
        {FILTERS.map((x) => (
          <button
            key={x.id}
            type="button"
            role="radio"
            aria-checked={filter === x.id}
            onClick={() => setFilter(x.id)}
            className={clsx(
              "rounded-full border px-4 py-2 text-sm font-medium transition",
              filter === x.id ? "border-ink bg-ink text-paper" : "border-line text-muted hover:text-ink",
            )}
          >
            {x.label}
          </button>
        ))}
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t) => (
          <TemplateCard key={t.meta.slug} t={t} />
        ))}
      </div>
    </div>
  );
}
