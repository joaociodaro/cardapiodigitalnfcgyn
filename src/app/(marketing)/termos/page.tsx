import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Termos de uso" };

/*
 * MODELO INICIAL. Antes de publicar: preencha [RAZÃO SOCIAL], [CNPJ] e
 * [ENDEREÇO] e revise o texto com assessoria jurídica.
 */
export default function TermosPage() {
  return (
    <LegalPage
      title="Termos de uso"
      updated="11 de outubro de 2026"
      sections={[
        {
          h: "Quem somos",
          p: [
            `${site.name} é uma plataforma de criação e hospedagem de cardápios digitais operada por [RAZÃO SOCIAL], inscrita no CNPJ sob o nº [CNPJ], com sede em [ENDEREÇO].`,
            "Ao criar uma conta ou contratar um plano, você concorda com estes termos.",
          ],
        },
        {
          h: "Conta e responsabilidades",
          p: [
            "Você é responsável pelas informações cadastradas, pela guarda da sua senha e por todo o conteúdo publicado no seu cardápio, incluindo produtos, preços, fotos, descrições e informações sobre alergênicos.",
            "É proibido publicar conteúdo ilegal, enganoso, que viole direitos de terceiros ou que use marcas e imagens sem autorização.",
          ],
        },
        {
          h: "Planos e pagamentos",
          p: [
            "Assinaturas mensais são cobradas de forma recorrente pelo Mercado Pago até o cancelamento. O cancelamento interrompe as próximas cobranças e o acesso permanece até o fim do período já pago.",
            "O pagamento único concede licença de uso do modelo escolhido, com hospedagem incluída pelo prazo informado no plano no momento da compra. Após esse prazo, a hospedagem pode ser renovada pelo valor vigente. A licença não inclui hospedagem vitalícia.",
            "Alterações de preço valem para novas contratações. Assinaturas em andamento serão comunicadas com antecedência mínima de 30 dias, conforme as regras do provedor de pagamento.",
          ],
        },
        {
          h: "Inadimplência e suspensão",
          p: [
            "Em caso de falha de pagamento, há um período de tolerância antes da suspensão da publicação. Durante a suspensão, o cardápio público fica indisponível, mas os dados da conta são preservados e o acesso é restabelecido após a regularização.",
          ],
        },
        {
          h: "Direito de arrependimento",
          p: [
            "Para contratações feitas pela internet, você pode desistir em até 7 dias corridos a partir da contratação, com reembolso integral, nos termos do art. 49 do Código de Defesa do Consumidor.",
          ],
        },
        {
          h: "Propriedade intelectual",
          p: [
            "Os modelos, o código e a identidade visual da plataforma pertencem à empresa. O conteúdo que você cadastra continua sendo seu; você nos autoriza a hospedá-lo e exibi-lo para prestar o serviço.",
          ],
        },
        {
          h: "Disponibilidade e limitação de responsabilidade",
          p: [
            "Trabalhamos para manter o serviço disponível de forma contínua, com backups regulares, mas podem ocorrer interrupções para manutenção ou por fatores externos. Pedidos enviados pelo WhatsApp são negociados diretamente entre o estabelecimento e o consumidor.",
          ],
        },
        {
          h: "Contato e foro",
          p: [`Dúvidas: ${site.email}. Fica eleito o foro do domicílio do consumidor para resolver eventuais controvérsias.`],
        },
      ]}
    />
  );
}
