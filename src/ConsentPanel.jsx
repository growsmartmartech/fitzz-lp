import { useState } from 'react';

export default function ConsentPanel({ open, consent, onSave }) {
  if (!open) return null;
  return <ConsentSettings consent={consent} onSave={onSave} />;
}

function ConsentSettings({ consent, onSave }) {
  const [configuring, setConfiguring] = useState(false);
  const [analytics, setAnalytics] = useState(consent.analytics === true);
  const [advertising, setAdvertising] = useState(consent.advertising === true);

  return (
    <section className="consent-banner" aria-label="Preferências de privacidade">
      <div className="consent-copy">
        <p className="consent-title">Queremos te dar as boas-vindas do seu jeito.</p>
        <p>
          Usamos tecnologias de rastreamento para entender o que você mais gosta e sugerir conteúdos e produtos
          que realmente importam para você.
        </p>
      </div>
      {configuring ? (
        <div className="consent-settings">
          <label>
            <input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} />
            <span><strong>Medição de audiência</strong><small>Permite enviar eventos de uso ao Google Analytics.</small></span>
          </label>
          <label>
            <input type="checkbox" checked={advertising} onChange={(event) => setAdvertising(event.target.checked)} />
            <span><strong>Publicidade</strong><small>Permite os sinais de medição e personalização de anúncios do Google.</small></span>
          </label>
          <div className="consent-actions">
            <button type="button" className="consent-button consent-secondary" onClick={() => onSave({ analytics: false, advertising: false })}>Recusar opcionais</button>
            <button type="button" className="consent-button consent-secondary" onClick={() => setConfiguring(false)}>Voltar</button>
            <button type="button" className="consent-button consent-primary" onClick={() => onSave({ analytics, advertising })}>Salvar escolhas</button>
          </div>
        </div>
      ) : (
        <div className="consent-actions">
          <button type="button" className="consent-button consent-primary" onClick={() => onSave({ analytics: true, advertising: true })}>Permitir Experiência Completa</button>
          <button type="button" className="consent-button consent-secondary" onClick={() => setConfiguring(true)}>Personalizar Opções</button>
        </div>
      )}
    </section>
  );
}
