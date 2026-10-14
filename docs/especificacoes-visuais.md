# Especificações visuais: captura Delivery

## Fontes e escopo

- Página existente: `src/App.jsx` e `src/App.css`; a alteração adiciona captura ao layout React/Vite atual, sem redesenhar as seções comerciais.
- Referência Fitzz consultada: `context/brand/README.md`, que aponta identidade com preto `#211F1F`, grafite `#383535`, oliva `#4D5238`/`#68773C`, verde `#A8CF45`/`#C7E088` e Montserrat.
- O logo usado na página atual vem do site institucional; o logo oficial local foi inspecionado, mas não substituído nesta mudança de integração.
- O formulário reutiliza os estilos encapsulados do componente Fitzz. O aviso de privacidade usa fundo branco, texto escuro, foco verde, estados visíveis e controles com pelo menos 44 px.

## Comportamento

- Formulário inline no bloco de simulação e launcher flutuante com diálogo modal, ambos com o produto `delivery-400` e pontos `landing_inline`/`landing_floating`.
- A caixa de comunicações futuras fica separada, opcional e desmarcada por padrão.
- O banner de consentimento oferece aceitar, recusar e configurar analytics/publicidade separadamente. Preferências podem ser reabertas no rodapé.
- O componente mantém confirmação, pendência, falha, indisponibilidade e link manual para WhatsApp após confirmação. Nenhum envio automático de mensagem ocorre.
- O aviso permanece adaptável a telas estreitas; estilos de foco e redução de movimento foram incluídos.

## Estado de conexão

No `.env.example`, as URLs públicas dos webhooks e os IDs específicos da LP Delivery estão configurados. Os workflows ativos validam o domínio `fitzz.com.br` e seus subdomínios HTTPS, incluindo a origem e os IDs desta página.
