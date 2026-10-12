import type { Metadata } from "next";
import { AuthPending } from "@/components/site/AuthPending";

export const metadata: Metadata = { title: "Recuperar senha", robots: { index: false } };

export default function Page() {
  return <AuthPending title="Recuperar senha" />;
}
