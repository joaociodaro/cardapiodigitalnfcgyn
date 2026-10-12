# Arquitetura

Plataforma SaaS de cardápios digitais. Este documento registra as decisões
que sustentam o produto e o plano de implementação por etapas.

## Stack

| Camada | Escolha |
| --- | --- |
| Front e back | Next.js 15 (App Router, Server Actions, Route Handlers), TypeScript |
| Estilo | Tailwind CSS 4, container queries, fontes auto-hospedadas (Fontsource) |
| Banco | Supabase Postgres com Row Level Security |
| Autenticação | Supabase Auth (e-mail e senha, confirmação, recuperação) |
| Arquivos | Supabase Storage (bucket `menu-media`) |
| Pagamentos | Mercado Pago: Checkout Pro (pagamento único, Pix e cartão) e Assinaturas (`preapproval`) |
| Hospedagem | Vercel |
| Testes | Vitest (regras de negócio e integridade dos modelos), SQL (RLS), Playwright (fluxos, etapa 8) |

## Decisões principais

### 1. Modelo = estrutura em código + tema em dados

Cada modelo é um componente React próprio (`src/templates/<slug>/Template.tsx`).
É isso que dá a cada um uma identidade estrutural real: o Royal Gold tem capa
cheia e carrossel do chef, o Tokyo usa grade de linhas finas, o Sweet Boutique
usa mosaico em colunas, e assim por diante.

Todos recebem a mesma entrada:

- `MenuDocument` — estabelecimento, categorias, produtos, configurações;
- `ThemeConfig` — cores, fontes e opções de layout.

O tema vira variáveis CSS (`--m-primary`, `--m-font-heading`, `--m-radius`…)
na raiz do cardápio (`src/menu-engine/theme.ts`). Os modelos só leem essas
variáveis, então qualquer alteração no editor aparece instantaneamente na
prévia, sem recarregar.

Cada modelo declara o que suporta (`capabilities`): por exemplo, o Velvet
Lounge aceita `large` e `list`, mas não `grid`. O editor só oferece opções
compatíveis, preservando a identidade do modelo.

### 2. Um único renderizador

`MenuRenderer` é usado na demonstração, na prévia do editor e no cardápio
publicado. A prévia é fiel por construção.

Os modelos usam **container queries** (`@3xl:`) em vez de media queries. Por
isso o mesmo cardápio se comporta como celular dentro da moldura de celular
do editor, mesmo em uma tela de computador. A moldura (`DeviceFrame`) usa
`transform` para conter os painéis `position: fixed` (detalhe do produto,
pedido) dentro do aparelho simulado.

### 3. "Usar este modelo" copia, nunca referencia

Ao criar um cardápio, o `demo_document` e o `default_theme` do modelo são
copiados para as tabelas do cliente, com `template_version` registrada. O
modelo original nunca é alterado, e atualizar um modelo no admin não muda
cardápios já personalizados.

### 4. Rascunho × publicado

- O editor grava nas tabelas normalizadas (`menu_categories`, `menu_products`…),
  com salvamento automático. Isso é o **rascunho**.
- **Publicar** gera um snapshot JSON em `menu_versions` e aponta
  `menus.published_version_id` para ele.
- `/menu/[slug]` lê somente o snapshot, via `get_published_menu()` (função
  `security definer`), e é revalidado sob demanda a cada publicação.
- O histórico de versões permite restaurar publicações anteriores.

### 5. QR Code permanente

Cada cardápio tem um código curto fixo em `qr_codes` (`/q/Ab3xK9`). O QR
aponta para esse código, que redireciona para o slug atual. Se o
estabelecimento trocar o slug, os slugs antigos ficam em `menu_slug_history`
e também redirecionam. Material impresso nunca quebra.

### 6. Acesso = licenças

Toda liberação de recurso passa por `licenses`:

| Origem | Como nasce | Validade |
| --- | --- | --- |
| `subscription` | pagamento recorrente aprovado | enquanto a assinatura estiver `active` (ou `past_due` dentro da tolerância) |
| `purchase` | pagamento único aprovado | até `hosting_until` (padrão: 12 meses, configurável por plano) |
| `admin_grant` | concedida no painel administrativo | definida pelo admin |

Uma função de servidor `getEntitlements(establishmentId)` (etapa 6) combina
licença, plano e `limits_override` e é chamada em toda ação sensível: publicar,
usar modelo premium, criar o segundo cardápio, habilitar pedidos pelo WhatsApp.
O frontend apenas reflete a decisão; nenhum recurso é liberado no navegador.

Inadimplência: a assinatura vai para `past_due`, ganha `grace_until`
(tolerância configurável em `platform_settings.billing`) e depois `suspended`.
O cardápio sai do ar, os dados permanecem.

### 7. Pagamentos à prova de falhas

1. Checkout criado no servidor, com o preço lido do banco (nunca do cliente).
2. Webhook `/api/webhooks/mercadopago` valida a assinatura `x-signature`
   (HMAC SHA-256 com `MERCADOPAGO_WEBHOOK_SECRET`).
3. O evento é gravado em `payment_events` com chave única
   `(provider, event_id)` — reenvios são ignorados (idempotência).
4. O pagamento é **consultado na API do Mercado Pago**; o corpo do webhook
   nunca é usado como fonte de verdade.
5. Só então `payments`, `subscriptions` e `licenses` são atualizados, numa
   transação.

Os provedores implementam a interface `PaymentProvider`, o que permite
adicionar outros gateways depois. Dados de cartão nunca passam pelo nosso
servidor.

### 8. Multi-tenant e administração

- Dados privados pertencem a um `establishment`; o acesso é decidido por
  `establishment_members` via funções `is_member()` e `member_role_of()`.
- Tabelas financeiras são somente leitura para clientes; escrita apenas
  pelo backend com `service_role`.
- O papel `platform_admin` é verificado no banco (`is_platform_admin()`) e no
  servidor, nunca só na interface.
- Toda ação administrativa grava em `audit_logs`.

Os testes em `supabase/tests/10_rls_isolation.sql` verificam, entre outros:
um cliente não lê nem altera dados de outro, não concede licença a si mesmo,
o visitante anônimo só vê o snapshot publicado, licença vencida tira o
cardápio do ar e slugs antigos redirecionam.

## Estrutura de pastas

```
src/
  app/
    (marketing)/          landing, /modelos, /planos, /como-funciona, /contato, /termos…
    (demo)/modelos/[slug] demonstração em tela cheia com troca de dispositivo
    (auth)/               /login, /cadastro, /recuperar-senha
    dashboard/            painel do cliente                (etapas 3–6)
    admin/                painel do proprietário           (etapa 7)
    menu/[slug]/          cardápio publicado               (etapa 5)
    q/[code]/             redirecionamento permanente do QR (etapa 5)
    api/webhooks/         webhooks de pagamento            (etapa 6)
  menu-engine/            tipos, tema, fontes, regras de pedido e runtime do cardápio
  templates/              os 10 modelos + registro
  components/             site, landing e componentes de cardápio (moldura, demo)
  config/                 marca, planos iniciais, perguntas frequentes
supabase/
  migrations/             schema, RLS, funções
  seed.sql                gerado por scripts/generate-seed.ts
  tests/                  testes de RLS
scripts/                  geração do seed e testes de banco
docs/                     este documento
```

## Entidades do banco

| Domínio | Tabelas |
| --- | --- |
| Identidade | `auth.users`, `profiles`, `roles`, `permissions`, `role_permissions`, `user_roles` |
| Tenants | `establishments`, `establishment_members` |
| Comercial | `plans`, `coupons`, `subscriptions`, `purchases`, `licenses`, `payments`, `payment_events`, `platform_settings` |
| Cardápio | `menu_templates`, `menus`, `menu_slug_history`, `menu_themes`, `menu_categories`, `menu_products`, `product_variations`, `product_addons`, `menu_versions`, `media_assets` |
| Publicação | `qr_codes`, `menu_views`, `menu_views_daily` |
| Operação | `support_requests`, `audit_logs` |

## Plano de implementação

| Etapa | Escopo | Situação |
| --- | --- | --- |
| 1 | Estrutura, identidade visual, landing e páginas públicas | ✅ |
| 2 | 10 modelos navegáveis, busca, detalhe do produto, pedido pelo WhatsApp | ✅ |
| 3 | Supabase Auth, cadastro/login/recuperação, estabelecimento, painel base | próxima |
| 4 | Editor visual: cores, fontes, imagens, layout, produtos, categorias, autosave | |
| 5 | Publicação, `/menu/[slug]`, QR Code (PNG/SVG/impressão), estatísticas | |
| 6 | Mercado Pago: checkout, assinaturas, webhooks, licenças, inadimplência | |
| 7 | Painel administrativo: financeiro, clientes, modelos, planos, cupons, auditoria | |
| 8 | Testes E2E, desempenho, segurança e implantação | |
