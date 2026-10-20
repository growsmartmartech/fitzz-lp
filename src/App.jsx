import { useEffect, useState } from 'react';
import './App.css';
import {
  Package,
  Zap,
  CircleDollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ShieldCheck,
  Wrench,
  ArrowRight,
  Star,
  MapPin,
  Battery,
  Wind,
} from 'lucide-react';
import ConsentPanel from './ConsentPanel.jsx';
import './fitzz-lead-capture.js';
import {
  consentUpdateEvent,
  readConsent,
  saveConsent,
  toMeasurementChoices,
  leadConfirmedEvent,
} from './consent.js';
import { isCaptureConfigReady, isValidFormId } from './lead-capture-config.js';

const POST_URL = import.meta.env.VITE_FITZZ_LEADS_POST_URL || 'https://automacao.growsmart.com.br/webhook/fitzz-leads';
const STATUS_URL = import.meta.env.VITE_FITZZ_LEADS_STATUS_URL || 'https://automacao.growsmart.com.br/webhook/fitzz-leads/status';
const INLINE_FORM_ID = import.meta.env.VITE_FITZZ_FORM_ID_INLINE || 'fitzz-delivery-inline';
const FLOATING_FORM_ID = import.meta.env.VITE_FITZZ_FORM_ID_FLOATING || 'fitzz-delivery-floating';
const INLINE_CAPTURE_READY = isCaptureConfigReady(POST_URL, INLINE_FORM_ID);
const FLOATING_CAPTURE_READY = isCaptureConfigReady(POST_URL, FLOATING_FORM_ID);

export default function App() {
  const [consent, setConsent] = useState(() => readConsent());
  const [consentOpen, setConsentOpen] = useState(() => !readConsent().decided);

  useEffect(() => {
    const measurementChoices = toMeasurementChoices(consent);
    if (consent.decided) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(consentUpdateEvent(consent));
    }

    const captureAttribution = consent.analytics === true || consent.advertising === true;
    const trackingAuthorized = consent.advertising === true;
    let active = true;
    customElements.whenDefined('fitzz-lead-capture').then(() => {
      if (!active) return;
      document.querySelectorAll('fitzz-lead-capture').forEach((form) => {
        if (form.dataset.deliveryConfigured !== 'true') {
          form.configure({
            products: [{ id: 'delivery-400', label: 'KIT DELIVERY-400' }],
            captureAttribution,
            trackingAuthorized,
            autoRedirect: false,
            communicationTextVersion: 'draft-v01',
            privacyNoticeVersion: 'privacy-v03',
            measurementChoices,
            texts: {
              eyebrow: 'Fale com a Fitzz',
              title: 'Converse com a equipe sobre o KIT DELIVERY-400.',
              description: 'Preencha seus dados e receba orientação para sua rotina de entregas.',
              optin: 'Aceito receber comunicações futuras da Fitzz.',
              privacyNote: 'Usaremos suas informações para entrar em contato sobre sua solicitação. Não enviamos spam.',
              submit: 'Enviar solicitação',
              launcher: 'Falar com a Fitzz',
            },
          });
          form.dataset.deliveryConfigured = 'true';
        } else {
          form.setMeasurementChoices(measurementChoices, { captureAttribution, trackingAuthorized });
        }
      });
    });

    const confirmedForms = new WeakSet();
    const onLeadState = (event) => {
      if (event.detail?.status === 'confirmed') {
        if (confirmedForms.has(event.target)) return;
        confirmedForms.add(event.target);
      }
      const confirmedEvent = leadConfirmedEvent(
        event.detail?.status,
        event.target.getAttribute('capture-point'),
        consent,
      );
      if (confirmedEvent) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(confirmedEvent);
      }
    };
    document.addEventListener('fitzz-lead-state', onLeadState);
    return () => {
      active = false;
      document.removeEventListener('fitzz-lead-state', onLeadState);
    };
  }, [consent]);

  const savePreferences = (choices) => {
    try {
      const saved = saveConsent(window.localStorage, choices);
      setConsent(saved);
      setConsentOpen(false);
    } catch {
      setConsent({ ...choices, decided: true });
      setConsentOpen(false);
    }
  };

  const scrollToForm = () => {
    const formSection = document.getElementById('simulador');
    if (!formSection) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    formSection.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  const testimonials = [
    {
      name: 'Carlos S.',
      city: 'São Paulo, SP',
      text: 'Dobrei minhas entregas no primeiro mês. O kit se pagou em menos de 3 meses. Melhor investimento que fiz!',
      stars: 5,
    },
    {
      name: 'Rodrigo M.',
      city: 'Rio de Janeiro, RJ',
      text: 'Termino o dia sem aquele cansaço todo. Consigo fazer muito mais pedidos e ainda sobra energia.',
      stars: 5,
    },
    {
      name: 'Thiago P.',
      city: 'Belo Horizonte, MG',
      text: 'A autonomia de 110km é real. Trabalho o dia inteiro sem preocupação. Suporte da Fitzz é top!',
      stars: 5,
    },
  ];

  const stats = [
    { value: '+15 anos', label: 'No mercado' },
    { value: '50.000+', label: 'Kits instalados' },
    { value: '110 km', label: 'Autonomia/dia' },
    { value: '1 ano', label: 'De garantia' },
  ];

  const benefits = [
    {
      icon: <Package size={28} aria-hidden="true" />,
      title: 'Mais Entregas',
      desc: 'Aumente sua produtividade e alcance mais clientes por dia, sem precisar de mais esforço.',
    },
    {
      icon: <Zap size={28} aria-hidden="true" />,
      title: 'Menos Cansaço',
      desc: 'Pedale com assistência elétrica e chegue ao fim do dia com energia para sua família.',
    },
    {
      icon: <CircleDollarSign size={28} aria-hidden="true" />,
      title: 'Mais no Bolso',
      desc: 'Economize até 50% em combustível e custos de manutenção todo mês.',
    },
    {
      icon: <Clock size={28} aria-hidden="true" />,
      title: 'Retorno Rápido',
      desc: 'Se paga em 3 a 4 meses de trabalho. Depois disso, é puro lucro!',
    },
    {
      icon: <Battery size={28} aria-hidden="true" />,
      title: 'Até 110 km/dia',
      desc: 'Autonomia real para trabalhar o dia inteiro sem preocupação com carga.',
    },
    {
      icon: <Wind size={28} aria-hidden="true" />,
      title: 'Zero Burocracia',
      desc: 'Sem CNH, IPVA ou licenciamento. Apenas liberdade e dinheiro no bolso.',
    },
  ];

  const comparison = [
    { label: 'Custo de Combustível', moto: 'Alto (gasolina)', fitzz: 'Zero (energia elétrica)' },
    { label: 'Manutenção', moto: 'Cara e complexa', fitzz: 'Simples e acessível' },
    { label: 'Impostos / Burocracia', moto: 'IPVA, CNH, Lic.', fitzz: 'Livre de burocracia' },
    { label: 'Agilidade no Trânsito', moto: 'Presa em congestionamentos', fitzz: 'Máxima agilidade' },
    { label: 'Cansaço Físico', moto: 'Alto (exposição ao sol, trânsito)', fitzz: 'Mínimo (pedalada assistida)' },
    { label: 'Autonomia diária', moto: 'Depende do combustível $', fitzz: 'Até 110 km/dia' },
  ];

  const assurances = [
    { icon: <CheckCircle2 size={22} aria-hidden="true" />, text: '1 ano de garantia total' },
    { icon: <Wrench size={22} aria-hidden="true" />, text: 'Suporte dedicado e peças acessíveis' },
    { icon: <Zap size={22} aria-hidden="true" />, text: 'Autonomia de até 110 km/dia' },
    { icon: <ShieldCheck size={22} aria-hidden="true" />, text: 'Instalação rápida e sem dificuldade' },
  ];

  const specifications = [
    { label: 'Autonomia', value: 'Até 110 km/dia' },
    { label: 'Burocracia (CNH, Doc)', value: 'Zero' },
    { label: 'Retorno do investimento', value: '3 a 4 meses' },
    { label: 'Aumento de faturamento', value: 'Até 50%' },
  ];

  return (
    <div className="site-shell">
      <header className="site-header" role="banner">
        <div className="container header-inner">
          <a className="brand-mark" href="#">
            <img src="/assets/fitzz-logo-white.png" alt="Logo Fitzz" />
          </a>
          <div className="header-actions">
            <a className="header-products" href="https://fitzz.com.br" target="_blank" rel="noopener noreferrer">
              Ver produtos
            </a>
            <button
              className="button button-primary button-header"
              onClick={scrollToForm}
              aria-label="Calcular meu lucro com kit elétrico Fitzz"
            >
              Calcular meu lucro
            </button>
          </div>
        </div>
      </header>

      <main id="conteudo-principal">
        <section className="hero-section">
          <div className="hero-orbit" aria-hidden="true" />
          <div className="container hero-layout">
            <div className="hero-copy">
              <div className="eyebrow hero-badge">
                <TrendingUp size={14} aria-hidden="true" />
                FATURAMENTO EM ATÉ 50% MAIS
              </div>

              <h1>
                Kit Elétrico para Bike: <span>A Revolução das Entregas</span>
              </h1>

              <p className="hero-subtitle">Transforme sua bike em uma E-Bike!</p>

              <p className="hero-description">
                Amigo Ciclista, diga adeus ao cansaço! Esta é a sua chance de{' '}
                <strong>revolucionar suas entregas e sua vida</strong>. Com o kit elétrico Fitzz,
                você ganha muito mais dinheiro todo mês.
              </p>

              <div className="hero-actions">
                <button
                  className="button button-primary button-hero"
                  onClick={scrollToForm}
                  aria-label="Calcular meu lucro com kit elétrico para bike"
                >
                  <span>CALCULAR MEU LUCRO AGORA</span>
                  <ArrowRight size={20} aria-hidden="true" />
                </button>
                <p className="cta-assurances">✓ Grátis &nbsp;✓ Sem compromisso &nbsp;✓ Resposta em minutos</p>
              </div>
            </div>

            <div className="hero-media-column">
              <div className="video-frame">
                <iframe
                  src="https://www.youtube.com/embed/mVyuLNgNqU4?start=73&autoplay=1&mute=1"
                  title="Depoimento Cliente Fitzz"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="return-badge">
                <span className="return-icon"><CircleDollarSign size={28} aria-hidden="true" /></span>
                <span className="return-copy">
                  <span className="return-label">Retorno</span>
                  <strong>Rápido e Garantido</strong>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-section" aria-label="Fitzz em números">
          <div className="container stats-grid">
            {stats.map((stat, i) => (
              <div className="stat-item" key={i}>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="benefits-section">
          <div className="container">
            <div className="section-heading section-heading-centered">
              <h2>A Solução Fitzz: Mais Lucro, Menos Esforço</h2>
              <p>Ciclista entregador, sabemos que a rua é dura. Mas e se houvesse uma forma de mudar essa realidade?</p>
            </div>

            <div className="benefits-grid">
              {benefits.map((card, i) => (
                <article className="benefit-card" key={i}>
                  <div className="benefit-icon">{card.icon}</div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="comparison-section">
          <div className="container comparison-container">
            <div className="section-heading section-heading-centered">
              <h2>Sua Liberdade, Agora Turbinada!</h2>
              <p>Vantagens incomparáveis quando você escolhe o kit Fitzz.</p>
            </div>

            <div className="table-scroll" tabIndex="0" aria-label="Comparação entre moto e bike elétrica Fitzz">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Característica</th>
                    <th className="comparison-other" scope="col">Moto</th>
                    <th className="comparison-fitzz" scope="col">Bike Elétrica Fitzz ⚡</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, i) => (
                    <tr key={i}>
                      <th scope="row">{row.label}</th>
                      <td className="comparison-other">
                        <XCircle size={16} aria-hidden="true" />
                        {row.moto}
                      </td>
                      <td className="comparison-fitzz">
                        <CheckCircle2 size={16} aria-hidden="true" />
                        {row.fitzz}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="authority-section">
          <div className="container authority-layout">
            <div className="authority-copy">
              <div className="eyebrow authority-badge">
                <ShieldCheck size={14} aria-hidden="true" />
                EMPRESA REFERÊNCIA NO BRASIL
              </div>
              <h2>Credibilidade e Confiança</h2>
              <p className="authority-description">
                Desde 2010, a Fitzz é líder e especialista em kits de conversão no Brasil. Milhares de entregadores já
                transformaram suas bikes em verdadeiras máquinas de faturar.
              </p>
              <ul className="assurance-list">
                {assurances.map((item, i) => (
                  <li key={i}>
                    <span className="assurance-icon">{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="performance-card">
              <div className="performance-seal" aria-hidden="true">
                <ShieldCheck size={40} />
              </div>
              <h3>Motor Robusto de Alta Performance</h3>
              <p className="performance-description">
                Mantenha a liberdade que só a bicicleta oferece, mas com a velocidade e a autonomia que o seu trabalho exige.
              </p>
              <div className="specification-list">
                {specifications.map((item, i) => (
                  <div className="specification-row" key={i}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="testimonials-section">
          <div className="container">
            <div className="section-heading section-heading-centered">
              <h2>Quem usa, recomenda!</h2>
              <p>Veja o que nossos clientes dizem após a instalação do kit.</p>
            </div>
            <div className="testimonials-grid">
              {testimonials.map((t, i) => (
                <article className="testimonial-card" key={i}>
                  <div className="testimonial-stars" aria-label={`${t.stars} estrelas`}>
                    {Array.from({ length: t.stars }).map((_, si) => (
                      <Star key={si} size={16} fill="currentColor" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="testimonial-quote">"{t.text}"</p>
                  <div className="testimonial-author">
                    <span className="avatar-mark">{t.name[0]}</span>
                    <span className="author-copy">
                      <strong>{t.name}</strong>
                      <span className="author-city"><MapPin size={12} aria-hidden="true" /> {t.city}</span>
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="form-section" id="simulador">
          <div className="form-orbit" aria-hidden="true" />
          <div className="form-container">
            <div className="form-card">
              <div className="form-card-heading">
                <div className="eyebrow form-badge">
                  <Zap size={14} aria-hidden="true" />
                  SIMULAÇÃO GRATUITA
                </div>
                <h2>VEJA O IMPACTO REAL DE UMA E-BIKE NO SEU DIA A DIA</h2>
                <p>Preencha o formulário e descubra como uma E-bike pode transformar sua rotina, garantindo conforto e lucro.</p>
              </div>

              <div className="form-card-body">
                <fitzz-lead-capture
                  mode="inline"
                  form-id={isValidFormId(INLINE_FORM_ID) ? INLINE_FORM_ID : undefined}
                  capture-point="landing_inline"
                  webhook-url={INLINE_CAPTURE_READY ? POST_URL : undefined}
                  status-url={STATUS_URL || undefined}
                  privacy-url="https://fitzz.com.br/politica-de-privacidade/"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <fitzz-lead-capture
        mode="floating"
        form-id={isValidFormId(FLOATING_FORM_ID) ? FLOATING_FORM_ID : undefined}
        capture-point="landing_floating"
        webhook-url={FLOATING_CAPTURE_READY ? POST_URL : undefined}
        status-url={STATUS_URL || undefined}
        privacy-url="https://fitzz.com.br/politica-de-privacidade/"
      />

      <footer className="site-footer" role="contentinfo">
        <div className="container footer-inner">
          <div className="footer-logo">
            <img src="/assets/fitzz-logo-white.png" alt="Logo Fitzz" />
          </div>
          <p className="copyright">© {new Date().getFullYear()} Fitzz. Todos os direitos reservados.</p>
          <div className="footer-socials">
            {['Instagram', 'Facebook', 'YouTube'].map((s) => (
              <a key={s} href="#">{s}</a>
            ))}
          </div>
          <button type="button" className="privacy-preferences-link" onClick={() => setConsentOpen(true)}>
            Preferências de privacidade
          </button>
        </div>
      </footer>

      <ConsentPanel
        open={consentOpen}
        consent={consent}
        onSave={savePreferences}
      />
    </div>
  );
}
