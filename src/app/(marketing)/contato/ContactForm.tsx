"use client";

import { useState } from "react";
import { site } from "@/config/site";

/**
 * Formulário de contato. Até a etapa de banco de dados, a mensagem é aberta
 * no aplicativo de e-mail do visitante (ou no WhatsApp, se configurado).
 * Na etapa 3 ela passa a ser gravada em `support_requests`.
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [subject, setSubject] = useState("Quero contratar");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const body = `Nome: ${name}\nE-mail: ${email}\nEstabelecimento: ${business}\n\n${message}`;

  function validate(): boolean {
    if (name.trim().length < 2) return setError("Informe seu nome."), false;
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Informe um e-mail válido para a resposta."), false;
    if (message.trim().length < 10) return setError("Conte um pouco mais na mensagem (mínimo de 10 caracteres)."), false;
    setError(null);
    return true;
  }

  function sendEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`[${subject}] ${business || name}`)}&body=${encodeURIComponent(body)}`;
  }

  function sendWhatsApp() {
    if (!validate()) return;
    window.open(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`${subject}\n\n${body}`)}`, "_blank", "noopener");
  }

  const field = "mt-1.5 w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-sm text-ink outline-none transition focus:border-accent";

  return (
    <form onSubmit={sendEmail} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-ink">
          Nome
          <input className={field} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
        </label>
        <label className="block text-sm font-medium text-ink">
          E-mail
          <input className={field} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-ink">
          Estabelecimento (opcional)
          <input className={field} value={business} onChange={(e) => setBusiness(e.target.value)} autoComplete="organization" />
        </label>
        <label className="block text-sm font-medium text-ink">
          Assunto
          <select className={field} value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option>Quero contratar</option>
            <option>Criação personalizada do cardápio</option>
            <option>Dúvida sobre planos</option>
            <option>Suporte técnico</option>
            <option>Outro assunto</option>
          </select>
        </label>
      </div>
      <label className="block text-sm font-medium text-ink">
        Mensagem
        <textarea className={`${field} min-h-36 resize-y`} value={message} onChange={(e) => setMessage(e.target.value)} required />
      </label>
      {error && (
        <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <button type="submit" className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-ink transition hover:opacity-90">
          Enviar por e-mail
        </button>
        {site.whatsapp && (
          <button type="button" onClick={sendWhatsApp} className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink">
            Enviar pelo WhatsApp
          </button>
        )}
      </div>
      <p className="text-xs text-muted">Ao enviar, sua mensagem abre no seu aplicativo de e-mail, pronta para envio.</p>
    </form>
  );
}
