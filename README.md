# Carta — cardápios digitais premium

Plataforma SaaS para criar, personalizar e publicar cardápios digitais a
partir de modelos prontos. "Carta" é um nome provisório: troque em
`src/config/site.ts`.

A arquitetura está descrita em [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md).

## O que já funciona (etapas 1 e 2)

- Landing page completa, com demonstração ao vivo dentro de um celular e troca de modelo.
- Páginas públicas: como funciona, modelos (com filtro), planos (mensal e pagamento único,
  tabela comparativa), perguntas frequentes, contato, termos e privacidade.
- **10 modelos de cardápio**, cada um com layout, tipografia e paleta próprios, 5 ou mais
  categorias e produtos fictícios com fotos, descrições, preços, variações, adicionais e alergênicos.
- Demonstração em `/modelos/[slug]` com simulação de celular, tablet e tela cheia.
- Em todos os modelos: navegação por categorias com destaque automático, busca sem acentos,
  detalhe do produto, itens indisponíveis, informações do estabelecimento e montagem de pedido
  com mensagem pronta para o WhatsApp.
- Tema claro e escuro na plataforma, SEO (metadados, sitemap, robots, FAQ estruturado), 404.
- Schema completo do banco com RLS, seed gerado a partir do código e testes de isolamento.

Ainda **não** estão ligados (próximas etapas): login/cadastro, editor, publicação real, QR Code,
pagamentos e painel administrativo. As telas de login e cadastro mostram um aviso enquanto isso.

## Rodando localmente

Requer Node 20.9 ou superior.

```bash
npm install
cp .env.example .env.local   # nesta etapa só NEXT_PUBLIC_SITE_URL é usada
npm run dev                  # http://localhost:3000
```

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | build de produção |
| `npm run typecheck` | verificação de tipos |
| `npm run lint` | ESLint |
| `npm test` | testes de regras de pedido e integridade dos 10 modelos |
| `npm run db:seed` | regenera `supabase/seed.sql` a partir de planos e modelos do código |
| `npm run test:db` | aplica migration + seed num Postgres de teste e roda os testes de RLS (precisa de `DATABASE_URL`) |

## Banco de dados (Supabase)

1. Crie um projeto em supabase.com.
2. Em **SQL Editor**, execute `supabase/migrations/20261011000000_initial_schema.sql` e depois `supabase/seed.sql`
   (ou use a Supabase CLI: `supabase db push` e `supabase db reset`).
3. Copie a URL e as chaves para `.env.local`.

Os arquivos em `supabase/tests/` são apenas para testes locais. **Não** execute
`00_supabase_stub.sql` no projeto Supabase.

## Variáveis de ambiente

Veja `.env.example`. Resumo:

| Variável | Onde obter | Etapa |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | domínio do site | 1 |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API | 3 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (somente servidor) | 3 |
| `MERCADOPAGO_ACCESS_TOKEN`, `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | Mercado Pago → Suas integrações → Credenciais | 6 |
| `MERCADOPAGO_WEBHOOK_SECRET` | Mercado Pago → Webhooks | 6 |
| `PLATFORM_ADMIN_EMAIL` | seu e-mail de administrador | 7 |

## Antes de publicar

- Preencha razão social, CNPJ e endereço em `/termos` e `/privacidade` e revise os textos com assessoria jurídica.
- Defina `site.email` e `site.whatsapp` em `src/config/site.ts`.
- As fotos das demonstrações vêm do Unsplash (uso comercial livre). Os nomes de estabelecimentos são fictícios.
