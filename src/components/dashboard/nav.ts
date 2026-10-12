import {
  BarChart3,
  CreditCard,
  FolderTree,
  LayoutDashboard,
  LayoutTemplate,
  LifeBuoy,
  type LucideIcon,
  Palette,
  PlusCircle,
  QrCode,
  Receipt,
  Settings,
  UtensilsCrossed,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  Icon: LucideIcon;
  exact?: boolean;
}

export const NAV_GROUPS: Array<{ label: string; items: NavItem[] }> = [
  {
    label: "Cardápio",
    items: [
      { href: "/dashboard", label: "Visão geral", Icon: LayoutDashboard, exact: true },
      { href: "/dashboard/cardapios", label: "Meus cardápios", Icon: UtensilsCrossed, exact: true },
      { href: "/dashboard/cardapios/novo", label: "Criar cardápio", Icon: PlusCircle },
      { href: "/dashboard/modelos", label: "Modelos disponíveis", Icon: LayoutTemplate },
      { href: "/dashboard/produtos", label: "Produtos e categorias", Icon: FolderTree },
      { href: "/dashboard/personalizacao", label: "Personalização", Icon: Palette },
      { href: "/dashboard/qr-codes", label: "QR Codes", Icon: QrCode },
      { href: "/dashboard/estatisticas", label: "Estatísticas", Icon: BarChart3 },
    ],
  },
  {
    label: "Conta",
    items: [
      { href: "/dashboard/assinatura", label: "Minha assinatura", Icon: CreditCard },
      { href: "/dashboard/pagamentos", label: "Pagamentos", Icon: Receipt },
      { href: "/dashboard/configuracoes", label: "Configurações", Icon: Settings },
      { href: "/dashboard/suporte", label: "Suporte", Icon: LifeBuoy },
    ],
  },
];
