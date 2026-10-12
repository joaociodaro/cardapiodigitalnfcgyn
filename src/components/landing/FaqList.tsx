import { Plus } from "lucide-react";
import { FAQ } from "@/config/faq";

export function FaqList({ limit }: { limit?: number }) {
  const items = limit ? FAQ.slice(0, limit) : FAQ;
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f) => (
        <details key={f.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-medium text-ink [&::-webkit-details-marker]:hidden">
            {f.q}
            <Plus className="size-4 shrink-0 text-muted transition-transform group-open:rotate-45" />
          </summary>
          <p className="max-w-2xl pb-6 text-sm leading-relaxed text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
