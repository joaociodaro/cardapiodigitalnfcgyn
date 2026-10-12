import type { Metadata } from "next";
import { AuthPending } from "@/components/site/AuthPending";

export const metadata: Metadata = { title: "Criar conta", robots: { index: false } };

export default function Page() {
  return <AuthPending title="Criar sua conta" />;
}
