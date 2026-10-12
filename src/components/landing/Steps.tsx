export const STEPS = [
  { title: "Escolha um modelo profissional", body: "Dez cardápios completos, cada um com layout, tipografia e paleta próprios. Navegue pelas demonstrações antes de decidir." },
  { title: "Crie sua conta", body: "Cadastro com e-mail e senha em menos de um minuto. Sua conta guarda seus cardápios, QR Codes e pagamentos." },
  { title: "Escolha um plano e pague", body: "Assinatura mensal ou pagamento único, pelo Mercado Pago. O editor é liberado assim que o pagamento é confirmado." },
  { title: "Personalize", body: "Troque logotipo, cores, fontes e fotos. Cadastre produtos, preços, adicionais e alergênicos, vendo a prévia em tempo real." },
  { title: "Publique e compartilhe", body: "Seu cardápio ganha um link próprio e um QR Code permanente para mesas, balcão, Instagram e WhatsApp." },
];

export function Steps() {
  return (
    <ol className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-5">
      {STEPS.map((s, i) => (
        <li key={s.title} className="flex flex-col bg-surface p-6">
          <span className="font-display text-5xl font-semibold text-accent tabular-nums" aria-hidden>
            {i + 1}
          </span>
          <h3 className="mt-6 font-display text-lg font-semibold leading-snug text-ink">{s.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
