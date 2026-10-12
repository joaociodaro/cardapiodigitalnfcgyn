# Carta — cardápios digitais premium

Plataforma SaaS para criar, personalizar e publicar cardápios digitais a
partir de modelos prontos. "Carta" é um nome provisório: troque em
`src/config/site.ts`.

A arquitetura está descrita em [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md).

## O que já funciona

**Etapas 1 e 2 — site e modelos**
- Landing page com demonstração ao vivo dentro de um celular e troca de modelo.
- Páginas públicas: como funciona, modelos (com filtro), planos, perguntas frequentes, contato, termos e privacidade.
- **10 modelos de cardápio** com layout, tipografia e paleta próprios, navegáveis em `/modelos/[slug]`
  com simulação de celular, tablet e tela cheia; busca, detalhe do produto e pedido pelo WhatsApp.

**Etapa 3 — contas e painel**
- Cadastro com confirmação de e-mail, login, logout, recuperação e redefinição de senha (Supabase Auth).
- Sessão renovada no servidor; `/dashboard` e `/admin` exigem login.
- Onboarding: criação do estabelecimento, preservando o modelo e o plano escolhidos na vitrine.
- Painel com os 12 itens do menu: visão geral, cardápios, modelos (com o que o plano libera),
  assinatura, pagamentos, configurações (estabelecimento, conta, senha, sessões, exclusão de conta) e suporte.
- Vários estabelecimentos por conta, com troca rápida.
- Direitos de uso calculados no servidor a partir das licenças (`src/lib/entitlements.ts`).
- Formulário de contato e suporte gravando no banco.

**Próximas etapas:** editor visual (4), publicação e QR Code (5), Mercado Pago (6), painel administrativo (7).

## Rodando localmente

Requer Node 20.9 ou superior.

```bash
npm install
cp .env.example .env.local   # preencha com os dados do seu projeto Supabase
npm run dev                  # http://localhost:3000
```

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | build de produção |
| `npm run typecheck` / `npm run lint` | verificação de tipos e ESLint |
| `npm test` | testes de pedidos, direitos de uso, validação de formulários e integridade dos modelos |
| `npm run test:db` | aplica as migrations num Postgres de teste e roda os testes de RLS (precisa de `DATABASE_URL`) |
| `npm run db:seed` | regenera `supabase/seed.sql` (planos e metadados dos modelos) a partir do código |
| `npm run db:types` | regenera os tipos TypeScript do banco (precisa de `DATABASE_URL`) |

## Supabase

O projeto `cardapio-digital` (região São Paulo) já está com as migrations e o seed aplicados.
Para um projeto novo: execute os arquivos de `supabase/migrations/` em ordem e depois `supabase/seed.sql`.
Os arquivos em `supabase/tests/` são só para testes locais — **não** execute `00_supabase_stub.sql` no Supabase.

### Configuração obrigatória de autenticação (painel do Supabase)

1. **Authentication → URL Configuration**
   - *Site URL*: o endereço do site em produção (ex.: `https://seudominio.com.br`).
   - *Redirect URLs*: `http://localhost:3000/**` e `https://seudominio.com.br/**`
     (e o domínio da Vercel, ex.: `https://*.vercel.app/**`, se for testar por lá).
2. **Authentication → Emails → SMTP Settings**: configure um SMTP próprio (Resend, Brevo, Amazon SES…).
   O envio padrão do Supabase só entrega para e-mails da equipe do projeto e tem limite baixo por hora,
   então clientes reais não receberiam a confirmação de cadastro.
3. (Opcional) **Authentication → Emails → Templates**: traduza os textos dos e-mails para português.

### Tornar-se administrador

Depois de criar sua conta pelo site, rode no SQL Editor (trocando o e-mail):

```sql
insert into public.user_roles (user_id, role_id)
select u.id, r.id from auth.users u, public.roles r
where u.email = 'seu-email@exemplo.com' and r.code = 'platform_admin';
```

### Liberar um plano manualmente (até a etapa de pagamentos)

```sql
insert into public.licenses (establishment_id, plan_id, source, hosting_until, notes)
select e.id, p.id, 'admin_grant', now() + interval '12 months', 'Pagamento manual'
from public.establishments e, public.plans p
where e.name = 'Nome do estabelecimento' and p.code = 'premium';
```

## Variáveis de ambiente

Veja `.env.example`. Configure as mesmas na Vercel.

| Variável | Onde obter | Etapa |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | domínio do site | 1 |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → Project Settings → API Keys | 3 |
| `SUPABASE_SECRET_KEY` | Supabase → Project Settings → API Keys → Secret keys (**somente servidor**) | 3 |
| `MERCADOPAGO_ACCESS_TOKEN`, `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`, `MERCADOPAGO_WEBHOOK_SECRET` | Mercado Pago → Suas integrações | 6 |
| `PLATFORM_ADMIN_EMAIL` | seu e-mail de administrador | 7 |

Sem `SUPABASE_SECRET_KEY`, a exclusão de conta anonimiza e bloqueia o acesso, mas o login só é
removido definitivamente quando a chave estiver configurada.

## Antes de publicar

- Preencha razão social, CNPJ e endereço em `/termos` e `/privacidade` e revise os textos com assessoria jurídica.
- Defina `site.email` e `site.whatsapp` em `src/config/site.ts`.
- As fotos das demonstrações vêm do Unsplash (uso comercial livre). Os nomes de estabelecimentos são fictícios.
