import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { EmptyState, formatDate } from "./ui";

const STATUS: Record<string, string> = { draft: "Rascunho", published: "Publicado", unpublished: "Despublicado", suspended: "Suspenso" };

/** Lista os cardápios do estabelecimento; sem cardápios, orienta o próximo passo. */
export async function MenuList({ establishmentId, emptyText, hasPlan }: { establishmentId: string; emptyText: string; hasPlan: boolean }) {
  const supabase = await createClient();
  const { data: menus } = await supabase
    .from("menus")
    .select("id, name, slug, status, updated_at, template:menu_templates(name)")
    .eq("establishment_id", establishmentId)
    .is("deleted_at", null)
    .order("created_at");

  if (!menus?.length) {
    return (
      <EmptyState
        Icon={UtensilsCrossed}
        title="Você ainda não tem cardápios"
        action={hasPlan ? { href: "/dashboard/cardapios/novo", label: "Criar cardápio" } : { href: "/dashboard/assinatura", label: "Escolher um plano" }}
      >
        <p>{emptyText}</p>
      </EmptyState>
    );
  }

  return (
    <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
      {menus.map((m) => (
        <li key={m.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div className="min-w-0">
            <p className="truncate font-medium text-ink">{m.name}</p>
            <p className="text-xs text-muted">
              {m.template?.name} · /menu/{m.slug} · atualizado em {formatDate(m.updated_at)}
            </p>
          </div>
          <span className="rounded-full border border-line px-2.5 py-1 text-xs text-muted">{STATUS[m.status]}</span>
        </li>
      ))}
    </ul>
  );
}

export function PlanRequiredNote() {
  return (
    <p className="mb-6 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-muted">
      O editor e a publicação são liberados assim que um plano é ativado.{" "}
      <Link href="/dashboard/assinatura" className="font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4">
        Ver planos
      </Link>
    </p>
  );
}
