import type { Metadata } from "next";
import { AuthPending } from "@/components/site/AuthPending";

export const metadata: Metadata = { title: "Entrar", robots: { index: false } };

export default function Page() {
  return <AuthPending title="Entrar na sua conta" />;
}
