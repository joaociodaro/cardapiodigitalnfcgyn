import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TEMPLATES, getTemplate } from "@/templates/registry";
import { DemoViewer } from "@/components/menu/DemoViewer";

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ slug: t.meta.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = getTemplate(slug);
  if (!t) return {};
  return {
    title: `Modelo ${t.meta.name} — demonstração`,
    description: `${t.meta.description} ${t.meta.segment}.`,
    openGraph: { images: [t.meta.previewImage] },
  };
}

export default async function TemplateDemoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getTemplate(slug)) notFound();
  return <DemoViewer slug={slug} />;
}
