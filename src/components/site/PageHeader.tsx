export function PageHeader({ title, lead, children }: { title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <div className="border-b border-line">
      <div className="mx-auto max-w-6xl px-5 pb-14 pt-14 sm:pt-20">
        <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-[-0.025em] text-ink sm:text-6xl">{title}</h1>
        {lead && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{lead}</p>}
        {children}
      </div>
    </div>
  );
}
