import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Política de privacidade" };

/*
 * MODELO INICIAL alinhado à LGPD (Lei 13.709/2018). Preencha os dados entre
 * colchetes e revise com assessoria jurídica antes de publicar.
 */
export default function PrivacidadePage() {
  return (
    <LegalPage
      title="Política de privacidade"
      updated="11 de outubro de 2026"
      sections={[
        {
          h: "Controlador e encarregado",
          p: [
            `O controlador dos dados é [RAZÃO SOCIAL], CNPJ [CNPJ]. O encarregado pelo tratamento de dados pessoais (DPO) pode ser contatado em ${site.email}.`,
          ],
        },
        {
          h: "Dados que coletamos",
          p: [
            "Dos clientes da plataforma: nome, e-mail, telefone, dados do estabelecimento e histórico de contratações. Dados de cartão são informados diretamente ao Mercado Pago e não são armazenados por nós.",
            "Dos visitantes dos cardápios: dados técnicos agregados de acesso (data, tipo de dispositivo e cidade aproximada) para estatísticas. Não exigimos cadastro do consumidor final e não exibimos anúncios de terceiros.",
          ],
        },
        {
          h: "Para que usamos",
          p: [
            "Para prestar o serviço contratado (execução de contrato), processar pagamentos, enviar comunicações sobre a conta, cumprir obrigações legais e fiscais e melhorar a plataforma (legítimo interesse).",
          ],
        },
        {
          h: "Compartilhamento",
          p: [
            "Compartilhamos dados apenas com operadores necessários ao serviço: Supabase (banco de dados e autenticação), Vercel (hospedagem) e Mercado Pago (pagamentos). Esses fornecedores podem armazenar dados fora do Brasil, com salvaguardas contratuais.",
          ],
        },
        {
          h: "Retenção",
          p: [
            "Mantemos os dados enquanto a conta estiver ativa. Após a exclusão da conta, removemos os dados pessoais, exceto os que precisamos guardar por obrigação legal, como registros fiscais e de pagamentos (prazo de até 5 anos) e registros de acesso (6 meses, Marco Civil da Internet).",
          ],
        },
        {
          h: "Seus direitos",
          p: [
            "Você pode solicitar confirmação de tratamento, acesso, correção, portabilidade, anonimização ou eliminação dos seus dados e revogar consentimentos, pelo e-mail do encarregado ou nas configurações da conta.",
          ],
        },
        {
          h: "Segurança",
          p: [
            "Usamos conexão criptografada (HTTPS), senhas protegidas por hash, isolamento de dados entre estabelecimentos, controle de acesso por função, registros de auditoria e backups regulares.",
          ],
        },
        {
          h: "Cookies",
          p: ["Usamos apenas cookies essenciais para manter sua sessão e preferências (como o tema claro ou escuro)."],
        },
      ]}
    />
  );
}
