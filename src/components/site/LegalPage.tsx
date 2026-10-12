import { PageHeader } from "./PageHeader";

export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: Array<{ h: string; p: string[] }> }) {
  return (
    <>
      <PageHeader title={title} lead={`Última atualização: ${updated}`} />
      <article className="mx-auto max-w-3xl px-5 py-14">
        {sections.map((s, i) => (
          <section key={s.h} className="border-b border-line py-8 first:pt-0 last:border-0">
            <h2 className="font-display text-xl font-semibold text-ink">
              {i + 1}. {s.h}
            </h2>
            {s.p.map((t, j) => (
              <p key={j} className="mt-3 leading-relaxed text-muted">
                {t}
              </p>
            ))}
          </section>
        ))}
      </article>
    </>
  );
}
