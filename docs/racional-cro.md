# Racional CRO: captura Delivery

## Problema e objetivo

O formulário RD Station existente entregava a captura a um destino diferente do fluxo Fitzz auditado. A alteração propõe consolidar solicitação, validação e confirmação no componente compartilhado Fitzz, com presença inline e atalho flutuante para quem decide em momentos diferentes da página.

## Caminho de conversão

1. CTA da página leva ao bloco inline; o launcher permite abrir o formulário em modal.
2. Visitante informa nome, email, WhatsApp e produto de interesse; `KIT DELIVERY-400` é o único produto disponível.
3. Registro somente é considerado confirmado após a resposta contratual do backend.
4. Só depois da confirmação o visitante recebe o link manual do WhatsApp. A caixa de comunicação futura é opcional e separada.
5. `generate_lead` só é emitido depois da confirmação e com consentimento de analytics.

## Hipótese, não resultado medido

Hipótese: manter um formulário incorporado e oferecer o mesmo fluxo em um modal flutuante reduz esforço para visitantes que chegam ao fim da página sem aumentar campos ou misturar comunicação futura com atendimento. O elemento a comparar seria o ponto de entrada (inline ou launcher); o evento primário seria lead confirmado (`generate_lead` consentido). Não foi iniciado experimento e não há meta ou resultado observado.

## Limitações de atribuição

UTMs e domínio de referência são enviados ao n8n somente quando Analytics ou publicidade foram concedidos; GCLID, GBRAID e WBRAID dependem do consentimento de publicidade. A configuração de upload offline do Google Ads no workflow ainda não está ativa, então a transmissão desses dados não comprova atribuição nem envio de conversão aos relatórios.
