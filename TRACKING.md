# Rastreamento (GA4)

Propriedade: `G-3M9JLKCE6S` · Domínio: **lucasporto.fit**

O GA só é carregado depois que a pessoa clica em **Aceitar** no aviso de cookies (`assets/consent.js`). Sem aceite, nenhum evento é enviado. Todos os eventos abaixo saem de um único listener em `assets/track.js`.

## Eventos

### `whatsapp_click`
Disparado em todo link que leva ao WhatsApp: botões com a classe `js-wa` (conversa com o Lucas, montados por `assets/wa.js`), `wa.me`, `api.whatsapp.com` e o grupo `chat.whatsapp.com`.

| Parâmetro | Origem | Valores atuais |
|---|---|---|
| `page` | caminho da página | `home`, `bio`, `velocity`, `privacidade` |
| `section` | `data-section` no link ou no bloco que o contém | ver tabela abaixo |
| `plano` | `data-plan` do botão (já existia) | ex.: `Consultoria Online – Trimestral (R$ 510)` |

| Página | `section` | Onde |
|---|---|---|
| home | `hero` | botão "Chamar no WhatsApp" do topo |
| home | `consultoria_online` | botões dos planos da Consultoria Online |
| home | `planos_mensais` | botões do Acompanhamento mensal e "Falar no WhatsApp" |
| home | `contato` | botão do rodapé "Bora começar?" |
| home | `botao_flutuante` | botão flutuante |
| bio | `time_do_porto` | card do grupo (link de grupo) |
| bio | `rodape` | link "WhatsApp" do rodapé |
| velocity | `time_do_porto` | botão "Quero entrar no time" da seção Time do Porto (grupo) |
| velocity | `desafios` | botão "Quero entrar no time" da seção Desafios (grupo) |
| privacidade | `contato` | link de contato |

> Cliques no **grupo** do Time do Porto também contam como `whatsapp_click`. Para ver só conversas com o Lucas, filtre `section` diferente de `time_do_porto` e `desafios`.

### `bio_link_click`
Disparado em cada link da `/bio/` com `data-link-name`.

| Parâmetro | Valores |
|---|---|
| `page` | `bio` |
| `link_name` | `velocity`, `site`, `time_do_porto`, `playlist`, `instagram`, `whatsapp`, `privacidade` |

Os links da bio que vão ao WhatsApp (`time_do_porto` e `whatsapp`) disparam **os dois** eventos.

### Envio antes da navegação
Os eventos usam `transport_type: 'beacon'`. Links que abrem na mesma aba (ex.: `velocity` e `site` na bio) seguram a navegação até o GA confirmar o envio (`event_callback`) ou por no máximo 300 ms.

## Página /qr/
- Sem GA (não carrega `consent.js`), para não contar as vezes que o Lucas abre a página para mostrar o QR Code.
- `<meta name="robots" content="noindex, nofollow">`.
- Nenhuma página pública tem link para `/qr/`. O site não tem sitemap.

## Links internos
Links entre páginas do site **não usam UTM** (UTM em link interno cria uma sessão nova no GA4). Use UTM só em links divulgados fora do site.

## Passos manuais no painel do GA4
1. **Evento principal:** Administrador → Exibição de dados → Eventos → aba "Eventos recentes" → marque a estrela de `whatsapp_click`. *(Já feito em 23/10/2026.)*
2. **Dimensões personalizadas** (Administrador → Exibição de dados → Definições personalizadas → Criar dimensão personalizada), todas com escopo **Evento**:

   | Nome da dimensão | Parâmetro do evento |
   |---|---|
   | Seção | `section` *(criada em 22/11/2026)* |
   | Página do clique | `page` *(criada em 22/11/2026)* |
   | Link da bio | `link_name` *(criada em 22/11/2026)* |
   | Plano | `plano` *(já criada em 23/10/2026)* |

   As dimensões só mostram dados a partir do dia em que são criadas. O evento pode levar até 24 h para aparecer na lista de parâmetros; se `section` não aparecer no seletor, digite o nome manualmente.
3. **Testar:** Administrador → Exibição de dados → **DebugView**, ou Relatórios → Tempo real, aceitando os cookies no site.

## Links com UTM (para usar fora do site)

| Uso | URL |
|---|---|
| Link da bio do Instagram | `https://lucasporto.fit/bio/?utm_source=instagram&utm_medium=social&utm_campaign=bio` |
| Stories | `https://lucasporto.fit/bio/?utm_source=instagram&utm_medium=social&utm_campaign=stories` |
| Divulgação da Velocity | `https://lucasporto.fit/bio/?utm_source=instagram&utm_medium=social&utm_campaign=velocity` |
| Divulgação da Velocity (direto na página) | `https://lucasporto.fit/velocity/?utm_source=instagram&utm_medium=social&utm_campaign=velocity` |

Para outro canal, troque `utm_source`/`utm_medium` (ex.: `utm_source=whatsapp&utm_medium=status`).
