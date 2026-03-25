import { useEffect } from 'react';
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

export default function App() {
  useEffect(() => {
    if (window.RDStationForms) {
      new window.RDStationForms('delivery-9217716c5a85366ebd0d', 'UA-142109495-1').createForm();
    }
  }, []);

  const scrollToForm = () => {
    document.getElementById('simulador').scrollIntoView({ behavior: 'smooth' });
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-50" role="banner">
        <div
          style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <a href="#" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="https://fitzz.com.br/wp-content/themes/_ecommerce-abc/static/images/logo-transparente.png"
              alt="Logo Fitzz"
              style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
            />
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a
              href="https://fitzz.com.br"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#475569', fontWeight: '600', fontSize: '0.9rem', textDecoration: 'none', display: 'none' }}
              className="hidden-mobile"
            >
              Ver produtos
            </a>
            <button
              onClick={scrollToForm}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#8ab120',
                color: 'white',
                padding: '0.6rem 1.25rem',
                borderRadius: '9999px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
              aria-label="Calcular meu lucro com kit elétrico Fitzz"
            >
              Calcular meu lucro
            </button>
          </div>
        </div>
      </header>

      <main id="conteudo-principal">

      {/* HERO */}
      <section
        style={{
          background: 'linear-gradient(135deg, #f5fbe5 0%, #ffffff 60%, #f5fbe5 100%)',
          borderBottom: '1px solid #e2e8f0',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '4rem 1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
          }}
        >
          <div style={{ maxWidth: '560px' }}>
            {/* Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.9rem',
                borderRadius: '9999px',
                background: '#eef7c0',
                color: '#5c7a10',
                fontSize: '0.8rem',
                fontWeight: '800',
                marginBottom: '1.5rem',
                letterSpacing: '0.05em',
              }}
            >
              <TrendingUp size={14} />
              FATURAMENTO EM ATÉ 50% MAIS
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                fontWeight: '900',
                color: '#0f172a',
                lineHeight: '1.1',
                marginBottom: '1rem',
                letterSpacing: '-0.03em',
              }}
            >
              Kit Elétrico para Bike:{' '}
              <span style={{ color: '#8ab120' }}>A Revolução das Entregas</span>
            </h1>

            <p
              style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#8ab120',
                marginBottom: '1rem',
              }}
            >
              Transforme sua bike em uma E-Bike!
            </p>

            <p
              style={{
                fontSize: '1.05rem',
                color: '#475569',
                lineHeight: '1.7',
                marginBottom: '2rem',
              }}
            >
              Amigo Ciclista, diga adeus ao cansaço! Esta é a sua chance de{' '}
              <strong style={{ color: '#0f172a' }}>revolucionar suas entregas e sua vida</strong>. Com o kit elétrico Fitzz,
              você ganha muito mais dinheiro todo mês.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '400px' }}>
              <button
                onClick={scrollToForm}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  background: '#8ab120',
                  color: 'white',
                  padding: '1rem 2rem',
                  borderRadius: '9999px',
                  fontSize: '1rem',
                  fontWeight: '800',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(138,177,32,0.35)',
                  letterSpacing: '0.02em',
                }}
                aria-label="Calcular meu lucro com kit elétrico para bike"
              >
                CALCULAR MEU LUCRO AGORA
                <ArrowRight size={20} />
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
                ✓ Grátis &nbsp;✓ Sem compromisso &nbsp;✓ Resposta em minutos
              </p>
            </div>
          </div>

          {/* Video + Badge */}
          <div style={{ position: 'relative', width: '100%' }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, #eef7c0, #f5fbe5)',
                borderRadius: '1.5rem',
                transform: 'rotate(2deg) scale(1.04)',
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: 'relative',
                width: '100%',
                paddingBottom: '56.25%',
                borderRadius: '1.5rem',
                overflow: 'hidden',
                boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                border: '4px solid white',
                background: '#e2e8f0',
                zIndex: 1,
              }}
            >
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                src="https://www.youtube.com/embed/mVyuLNgNqU4?start=73&autoplay=1&mute=1"
                title="Depoimento Cliente Fitzz"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Floating badge */}
            <div
              className="animate-bounce-slow"
              style={{
                position: 'absolute',
                bottom: '-1.5rem',
                left: '-1rem',
                background: 'white',
                padding: '1rem',
                borderRadius: '1rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                zIndex: 10,
              }}
            >
              <div
                style={{
                  background: '#eef7c0',
                  padding: '0.6rem',
                  borderRadius: '50%',
                }}
              >
                <CircleDollarSign size={28} color="#8ab120" />
              </div>
              <div>
                <p style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Retorno
                </p>
                <p style={{ color: '#0f172a', fontWeight: '800', fontSize: '0.95rem' }}>Rápido e Garantido</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ background: '#0f172a', color: 'white' }}>
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '2rem 1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
          }}
        >
          {stats.map((stat, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '900', color: '#a6ce37', marginBottom: '0.25rem' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section style={{ padding: '5rem 1.5rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: '900', color: '#0f172a', marginBottom: '1rem' }}>
              A Solução Fitzz: Mais Lucro, Menos Esforço
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.6' }}>
              Ciclista entregador, sabemos que a rua é dura. Mas e se houvesse uma forma de mudar essa realidade?
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {[
              {
                icon: <Package size={28} color="#ea580c" />,
                bg: '#fff7ed',
                title: 'Mais Entregas',
                desc: 'Aumente sua produtividade e alcance mais clientes por dia, sem precisar de mais esforço.',
              },
              {
                icon: <Zap size={28} color="#ca8a04" />,
                bg: '#fefce8',
                title: 'Menos Cansaço',
                desc: 'Pedale com assistência elétrica e chegue ao fim do dia com energia para sua família.',
              },
              {
                icon: <CircleDollarSign size={28} color="#8ab120" />,
                bg: '#f5fbe5',
                title: 'Mais no Bolso',
                desc: 'Economize até 50% em combustível e custos de manutenção todo mês.',
              },
              {
                icon: <Clock size={28} color="#2563eb" />,
                bg: '#eff6ff',
                title: 'Retorno Rápido',
                desc: 'Se paga em 3 a 4 meses de trabalho. Depois disso, é puro lucro!',
              },
              {
                icon: <Battery size={28} color="#7c3aed" />,
                bg: '#f5f3ff',
                title: 'Até 110 km/dia',
                desc: 'Autonomia real para trabalhar o dia inteiro sem preocupação com carga.',
              },
              {
                icon: <Wind size={28} color="#0891b2" />,
                bg: '#ecfeff',
                title: 'Zero Burocracia',
                desc: 'Sem CNH, IPVA ou licenciamento. Apenas liberdade e dinheiro no bolso.',
              },
            ].map((card, i) => (
              <div
                key={i}
                style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '1.25rem',
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  transition: 'box-shadow 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)')}
              >
                <div
                  style={{
                    background: card.bg,
                    width: '3.5rem',
                    height: '3.5rem',
                    borderRadius: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}
                >
                  {card.icon}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
                  {card.title}
                </h3>
                <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: '0.95rem' }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section style={{ padding: '5rem 1.5rem', background: 'white', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: '900', color: '#0f172a', marginBottom: '1rem' }}>
              Sua Liberdade, Agora Turbinada!
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#475569' }}>
              Vantagens incomparáveis quando você escolhe o kit Fitzz.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th style={{ padding: '1rem', borderBottom: '2px solid #f1f5f9', color: '#64748b', fontWeight: '700', width: '34%' }}>
                    Característica
                  </th>
                  <th
                    style={{
                      padding: '1rem',
                      borderBottom: '2px solid #f1f5f9',
                      color: '#64748b',
                      fontWeight: '700',
                      textAlign: 'center',
                      background: '#f8fafc',
                      width: '33%',
                    }}
                  >
                    Moto
                  </th>
                  <th
                    style={{
                      padding: '1rem',
                      borderBottom: '2px solid #8ab120',
                      color: '#8ab120',
                      fontWeight: '800',
                      textAlign: 'center',
                      background: '#f5fbe5',
                      width: '33%',
                      borderRadius: '0.5rem 0.5rem 0 0',
                    }}
                  >
                    Bike Elétrica Fitzz ⚡
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Custo de Combustível', moto: 'Alto (gasolina)', fitzz: 'Zero (energia elétrica)' },
                  { label: 'Manutenção', moto: 'Cara e complexa', fitzz: 'Simples e acessível' },
                  { label: 'Impostos / Burocracia', moto: 'IPVA, CNH, Lic.', fitzz: 'Livre de burocracia' },
                  { label: 'Agilidade no Trânsito', moto: 'Presa em congestionamentos', fitzz: 'Máxima agilidade' },
                  { label: 'Cansaço Físico', moto: 'Alto (exposição ao sol, trânsito)', fitzz: 'Mínimo (pedalada assistida)' },
                  { label: 'Autonomia diária', moto: 'Depende do combustível $', fitzz: 'Até 110 km/dia' },
                ].map((row, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: '1px solid #f1f5f9' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '1rem', fontWeight: '600', color: '#334155' }}>{row.label}</td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#ef4444', fontWeight: '600', background: '#fafafa' }}>
                      <XCircle size={16} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }} />
                      {row.moto}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#8ab120', fontWeight: '700', background: '#f5fbe5' }}>
                      <CheckCircle2 size={16} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle', color: '#8ab120' }} />
                      {row.fitzz}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* AUTHORITY */}
      <section style={{ padding: '5rem 1.5rem', background: '#0f172a', color: 'white' }}>
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.9rem',
                borderRadius: '9999px',
                background: 'rgba(166,206,55,0.15)',
                color: '#a6ce37',
                fontSize: '0.8rem',
                fontWeight: '800',
                marginBottom: '1.5rem',
                letterSpacing: '0.05em',
              }}
            >
              <ShieldCheck size={14} />
              EMPRESA REFERÊNCIA NO BRASIL
            </div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: '900', color: 'white', marginBottom: '1.25rem' }}>
              Credibilidade e Confiança
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '2rem' }}>
              Desde 2010, a Fitzz é líder e especialista em kits de conversão no Brasil. Milhares de entregadores já
              transformaram suas bikes em verdadeiras máquinas de faturar.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { icon: <CheckCircle2 size={22} color="#a6ce37" />, text: '1 ano de garantia total' },
                { icon: <Wrench size={22} color="#a6ce37" />, text: 'Suporte dedicado e peças acessíveis' },
                { icon: <Zap size={22} color="#a6ce37" />, text: 'Autonomia de até 110 km/dia' },
                { icon: <ShieldCheck size={22} color="#a6ce37" />, text: 'Instalação rápida e sem dificuldade' },
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', fontSize: '1rem', fontWeight: '600' }}>
                  <div
                    style={{
                      background: 'rgba(166,206,55,0.15)',
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              background: '#1e293b',
              borderRadius: '1.5rem',
              padding: '2rem',
              border: '1px solid #334155',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-1.5rem',
                right: '-0.5rem',
                background: '#0f172a',
                borderRadius: '50%',
                border: '4px solid #1e293b',
                padding: '0.4rem',
              }}
            >
              <ShieldCheck size={40} color="#a6ce37" />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'white', marginBottom: '0.75rem' }}>
              Motor Robusto de Alta Performance
            </h3>
            <p style={{ color: '#64748b', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Mantenha a liberdade que só a bicicleta oferece, mas com a velocidade e a autonomia que o seu trabalho exige.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Autonomia', value: 'Até 110 km/dia' },
                { label: 'Burocracia (CNH, Doc)', value: 'Zero' },
                { label: 'Retorno do investimento', value: '3 a 4 meses' },
                { label: 'Aumento de faturamento', value: 'Até 50%' },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: '#0f172a',
                    padding: '0.875rem 1rem',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{item.label}</span>
                  <span style={{ fontWeight: '800', color: '#a6ce37', fontSize: '0.9rem' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '5rem 1.5rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: '900', color: '#0f172a', marginBottom: '1rem' }}>
              Quem usa, recomenda!
            </h2>
            <p style={{ color: '#475569', fontSize: '1.05rem' }}>Veja o que nossos clientes dizem após a instalação do kit.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {testimonials.map((t, i) => (
              <div
                key={i}
                style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '1.25rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <Star key={si} size={16} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>
                <p style={{ color: '#334155', lineHeight: '1.7', fontSize: '0.95rem', marginBottom: '1.25rem', fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #8ab120, #a6ce37)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '800',
                      fontSize: '1rem',
                      flexShrink: 0,
                    }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <p style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>{t.name}</p>
                    <p style={{ color: '#64748b', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={12} /> {t.city}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM CTA */}
      <section
        id="simulador"
        style={{
          padding: '5rem 1.5rem',
          background: 'linear-gradient(135deg, #8ab120, #5c7a10)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative */}
        <svg
          style={{ position: 'absolute', top: 0, left: '-10%', width: '120%', height: '100%', opacity: 0.07, pointerEvents: 'none' }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path d="M0,0 Q50,100 100,0 L100,100 L0,100 Z" fill="white" />
        </svg>

        <div style={{ maxWidth: '720px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              background: 'white',
              borderRadius: '1.5rem',
              overflow: 'hidden',
              boxShadow: '0 30px 60px rgba(0,0,0,0.2)',
            }}
          >
            {/* Form header */}
            <div
              style={{
                background: '#8ab120',
                padding: '2.5rem 2rem',
                textAlign: 'center',
                color: 'white',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(255,255,255,0.15)',
                  padding: '0.35rem 0.9rem',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  marginBottom: '1rem',
                  letterSpacing: '0.05em',
                }}
              >
                <Zap size={14} />
                SIMULAÇÃO GRATUITA
              </div>
              <h2
                style={{
                  fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
                  fontWeight: '900',
                  marginBottom: '0.75rem',
                  lineHeight: '1.2',
                }}
              >
                VEJA O IMPACTO REAL DE UMA E-BIKE NO SEU DIA A DIA
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', lineHeight: '1.5' }}>
                Preencha o formulário e descubra como uma E-bike pode transformar sua rotina, garantindo conforto e lucro.
              </p>
            </div>

            {/* Form body — RD Station */}
            <div style={{ padding: '2rem 2.5rem' }}>
              <div role="main" id="delivery-9217716c5a85366ebd0d"></div>
            </div>
          </div>
        </div>
      </section>

      </main>

      {/* FOOTER */}
      <footer style={{ background: '#020617', color: '#64748b', padding: '3rem 1.5rem', textAlign: 'center' }} role="contentinfo">
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <img
              src="https://fitzz.com.br/wp-content/themes/_ecommerce-abc/static/images/logo-transparente.png"
              alt="Logo Fitzz"
              style={{ height: '36px', width: 'auto', objectFit: 'contain', opacity: 0.6, filter: 'grayscale(1)' }}
            />
          </div>
          <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
            © {new Date().getFullYear()} Fitzz. Todos os direitos reservados.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.25rem' }}>
            {['Instagram', 'Facebook', 'YouTube'].map((s) => (
              <a
                key={s}
                href="#"
                style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}
                onMouseEnter={(e) => (e.target.style.color = 'white')}
                onMouseLeave={(e) => (e.target.style.color = '#64748b')}
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
