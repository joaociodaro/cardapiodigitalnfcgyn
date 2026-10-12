"use client";

import { useFormStatus } from "react-dom";
import { useId, useState, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import clsx from "clsx";

export const inputClass =
  "block w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-accent aria-[invalid=true]:border-red-600 disabled:opacity-60";

export function Field({
  label,
  error,
  hint,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: ReactNode }) {
  const id = useId();
  const [show, setShow] = useState(false);
  const isPassword = props.type === "password";
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative mt-1.5">
        <input
          id={id}
          {...props}
          type={isPassword && show ? "text" : props.type}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
          className={clsx(inputClass, isPassword && "pr-11")}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            aria-label={show ? "Ocultar senha" : "Mostrar senha"}
            className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted hover:text-ink"
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-xs font-medium text-red-700 dark:text-red-400">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function TextArea({
  label,
  error,
  hint,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string; hint?: ReactNode }) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>
      <textarea id={id} {...props} aria-invalid={!!error} className={clsx(inputClass, "mt-1.5 min-h-24 resize-y")} />
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red-700 dark:text-red-400">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function SubmitButton({
  children,
  pendingLabel,
  variant = "primary",
  className,
}: {
  children: ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "accent" | "danger" | "ghost";
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:cursor-wait disabled:opacity-70",
        variant === "primary" && "bg-brand text-brand-ink hover:opacity-90",
        variant === "accent" && "bg-accent text-accent-ink hover:brightness-105",
        variant === "danger" && "bg-red-700 text-white hover:bg-red-800",
        variant === "ghost" && "border border-line text-ink hover:border-ink/40",
        className,
      )}
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}

export function FormAlert({ tone, children }: { tone: "error" | "success" | "info"; children: ReactNode }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={clsx(
        "flex gap-2.5 rounded-xl border px-3.5 py-3 text-sm",
        tone === "error" && "border-red-300 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200",
        tone === "success" && "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
        tone === "info" && "border-line bg-surface-2 text-ink",
      )}
    >
      {tone === "error" ? <AlertCircle className="mt-0.5 size-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 size-4 shrink-0" />}
      <div>{children}</div>
    </div>
  );
}

export type ActionState = {
  ok?: boolean;
  message?: string;
  errors?: Partial<Record<string, string>>;
  values?: Record<string, string>;
};
