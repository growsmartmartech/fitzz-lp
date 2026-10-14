# Validação: captura de leads da LP Delivery

## Escopo publicado

- Landing: `https://delivery.fitzz.com.br/`, repositório `growsmartmartech/fitzz-lp`.
- Interface: formulário inline e botão flutuante que abre o mesmo formulário em modal. Campos: nome, e-mail, WhatsApp, produto de interesse e aceite opcional de comunicações.
- IDs: `fitzz-delivery-inline` e `fitzz-delivery-floating`; produto `delivery-400`; pontos `landing_inline` e `landing_floating`.
- Destino: webhooks compartilhados `/webhook/fitzz-leads` e `/webhook/fitzz-leads/status`; a conversa do WhatsApp só pode começar depois que a pessoa enviar a primeira mensagem.
- O workflow compartilha o canal Umbler Talk já escolhido para a landing de kits (CPF). A página Delivery não altera essa configuração.

## Contrato do workflow compartilhado

- WF01 (`UuN5z0LtrfQggod6`, versão publicada `ed8e8106-accb-4bf8-a482-74e1d0d6e9ce`) e WF04 (`jDiibP3YFAZKi4VZ`, versão publicada `4f49235c-732c-48a5-9bec-63b428ed5001`) estão ativos.
- Ambos aceitam a origem HTTPS do domínio `fitzz.com.br` e qualquer subdomínio HTTPS. O webhook usa CORS `*` porque n8n não configura wildcard de subdomínios; o próprio workflow valida o host e rejeita outras origens. A URL de captura também é validada no servidor.
- Form IDs seguem `fitzz-<slug>-inline` e `fitzz-<slug>-floating`, além dos IDs legados explicitamente mantidos para compatibilidade.
- O n8n aceita os avisos `draft-v01` e `privacy-v02`; o registro continua usando a configuração do canal Umbler Talk compartilhado.

## Consentimento e tracking

- O contêiner GTM `GTM-K2CKHQT`, versão 45, está publicado e ativo.
- Consent Mode v2 começa com Analytics e publicidade negados. O painel de preferências envia `fitzz_consent_update` com as mesmas chaves e versão `consent-v01` da landing de kits. O aceite opcional de comunicações permanece separado.
- Após confirmação no Umbler, o front-end envia uma única vez `fitzz_lead_confirmed` e `capture_point`, sem nome, e-mail, telefone, UTMs ou IDs de clique no evento do dataLayer.
- O GTM inclui Kits e Delivery nos acionadores de Consent Mode, page view, conversão de lead confirmado e bloqueio da tag legada RD. As tags GA4 e Google Ads dependem do consentimento correspondente.
- UTMs e domínio de referência só são transmitidos ao n8n com Analytics ou publicidade concedida. GCLID, GBRAID e WBRAID só são transmitidos com publicidade concedida.
- O envio offline de conversão do Google Ads pelo n8n ainda não está configurado. Evento enviado por tag e atribuição nos relatórios do Ads são verificações diferentes.

## Verificações locais

- Testes do contrato n8n: 24 passaram.
- Testes de consentimento e captura: 5 passaram.
- ESLint e build de produção Vite: passaram.
- `git diff --check`: passou.

## Validação em produção

Ainda pendente nesta versão do documento: confirmar o deploy da aplicação, enviar um lead sintético com UTMs de teste, conferir resposta de status, fazer read-back dos campos no Umbler, validar um único evento/tag no Tag Assistant e excluir o contato de teste após a conferência. Não enviar mensagem pelo WhatsApp. Não afirmar atribuição a clique real de anúncio sem um teste com clique e atualização dos relatórios do Google Ads.
