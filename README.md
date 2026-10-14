# Fitzz Delivery

Landing React + Vite publicada em `https://delivery.fitzz.com.br/`. O formulário da seção de simulação e o botão flutuante usam o componente compartilhado `src/fitzz-lead-capture.js`.

## Captura

O formulário coleta nome, e-mail, WhatsApp, produto de interesse e aceite opcional de comunicações. Para Delivery, o catálogo apresenta somente `KIT DELIVERY-400`. A submissão usa o POST e a consulta de status documentados pelo fluxo n8n. O componente só libera o link para WhatsApp depois da confirmação do cadastro pelo Umbler Talk; a pessoa precisa enviar a primeira mensagem para iniciar a conversa.

Os IDs são `fitzz-delivery-inline` e `fitzz-delivery-floating`. O n8n deve aceitar `https://fitzz.com.br` e qualquer subdomínio HTTPS de `fitzz.com.br`, validando o host no próprio workflow. O CORS do webhook usa `*` porque n8n não oferece wildcard por subdomínio; a validação de origem no servidor rejeita domínios externos. IDs no padrão `fitzz-<slug>-inline` e `fitzz-<slug>-floating` podem reutilizar o workflow, mantendo produtos, pontos de captura e versões de aviso cadastrados.

## Consentimento e mensuração

O Consent Mode v2 começa negado antes do GTM `GTM-K2CKHQT`. A escolha explícita usa o evento `fitzz_consent_update` e as mesmas chaves e versão `consent-v01` da landing de kits; comunicações futuras continuam separadas. Após confirmação do Umbler, a página envia ao dataLayer somente `fitzz_lead_confirmed` e `capture_point`. GA4 (`generate_lead`) e Google Ads são disparados pelo GTM, conforme consentimento e acionador, sem PII no evento. UTMs e domínio de referência só vão ao n8n com Analytics ou publicidade concedida; GCLID, GBRAID e WBRAID dependem da autorização de publicidade.

A versão 45 do contêiner GTM está ativa e inclui a Delivery junto da landing de kits nos acionadores de Consent Mode, visualização de página, lead confirmado e bloqueio da RD. Para cada nova landing, o n8n já aceita o domínio; acrescente o hostname aos acionadores do GTM e valide a prévia antes de publicar. A tag do Google Ads está no fluxo de conversão após confirmação do Umbler, mas isso não comprova atribuição em relatório nem upload offline: a configuração offline de Google Ads no workflow n8n permanece pendente.

## Desenvolvimento e verificação

```sh
pnpm install --no-lockfile
pnpm run dev --host 127.0.0.1
pnpm run build
pnpm run lint
node --test tests/*.test.js
```

O build e os testes locais não validam CORS, persistência no PostgreSQL, gravação no Umbler, conversa iniciada no WhatsApp nem atribuição nos relatórios do Google Ads. Consulte [docs/validacao.md](docs/validacao.md) para o registro desta publicação e das validações pendentes.
