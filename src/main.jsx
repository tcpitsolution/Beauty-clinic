import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Instagram, Facebook, Mail, MapPin, ArrowUpRight, Sparkles, Heart, Flower2, Menu, MessageCircle, ArrowRight, X, Send, Bot } from 'lucide-react';
import './styles.css';

import imgHero from './img-hero.jpg';
import imgS1   from './img-s1.jpg';
import imgS2   from './img-s2.jpg';
import imgS3   from './img-s3.jpg';

const PHONE = '593999272654';
const message = encodeURIComponent('Hola, Beauty Life. Me gustaría recibir información sobre sus tratamientos y agendar una valoración.');
const whatsapp = `https://wa.me/${PHONE}?text=${message}`;
const address = 'Av. Cristóbal Colón y Reina Victoria, Edificio Banco de Guayaquil, piso 4, oficina 405-A, Quito, Ecuador.';
const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
const year = new Date().getFullYear();

/* ── Scroll-reveal hook ── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Brand({ footer = false }) {
  return <a className={`brand ${footer ? 'brand-footer' : ''}`} href="#inicio" aria-label="Beauty Life, inicio">
    <span className="brand-mark"><Flower2 size={footer ? 23 : 27} strokeWidth={1.15} /></span>
    <span className="brand-words"><span className="brand-name">BEAUTY LIFE</span><span className="brand-subtitle">CENTRO ESTÉTICO</span></span>
  </a>;
}

function Header() {
  return <header className="site-header"><div className="header-inner"><Brand /><nav className="main-nav" aria-label="Navegación principal">
    <a href="#inicio">Inicio</a><a href="#nosotros">Nosotros</a><a href="#tratamientos">Tratamientos</a><a href="#opiniones">Opiniones</a><a href="#contacto">Contacto</a>
  </nav><a className="header-cta" href={whatsapp} target="_blank" rel="noreferrer">Agenda tu valoración <ArrowUpRight size={15}/></a><a className="mobile-menu" href="#footer" aria-label="Ir al menú del pie de página"><Menu /></a></div></header>;
}

/* ── AI Chat Widget ── */
const BOT_NAME = 'Beauty Life';
const INITIAL_MSG = { from: 'bot', text: '¡Hola! 👋 Soy tu asistente virtual de Beauty Life. ¿En qué puedo ayudarte hoy?' };

const FAQ = [
  { q: '¿Qué tratamientos ofrecen?', a: 'Ofrecemos moldeamiento corporal, drenaje postquirúrgico, aparatología estética, reducción de medidas sin cirugía y asesoramiento cosmético personalizado. ✨' },
  { q: '¿Cómo agendo una cita?', a: 'Puedes agendar tu valoración directamente por WhatsApp. Te atendemos con mucho gusto. 📅' },
  { q: '¿Dónde están ubicados?', a: 'Estamos en Av. Cristóbal Colón y Reina Victoria, Edificio Banco de Guayaquil, piso 4, oficina 405-A, Quito, Ecuador. 📍' },
  { q: '¿Cuál es el horario?', a: 'Escríbenos por WhatsApp y te confirmamos disponibilidad. ¡Estamos para atenderte! 🕐' },
  { q: 'Hablar con una asesora', a: null },
];

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([INITIAL_MSG]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { const t = setTimeout(() => setShowBubble(true), 3000); return () => clearTimeout(t); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);

  function botReply(text) {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(m => [...m, { from: 'bot', text }]);
    }, 1100);
  }

  function handleQuick(item) {
    setMsgs(m => [...m, { from: 'user', text: item.q }]);
    if (item.a === null) {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMsgs(m => [...m, { from: 'bot', text: '¡Claro! Te conecto ahora mismo con una de nuestras asesoras. 💬', action: 'whatsapp' }]);
      }, 900);
    } else {
      botReply(item.a);
    }
  }

  function handleSend() {
    const val = input.trim();
    if (!val) return;
    setInput('');
    setMsgs(m => [...m, { from: 'user', text: val }]);
    botReply('Gracias por tu mensaje. Para una respuesta inmediata, te recomendamos contactarnos por WhatsApp. ¡Estamos para ayudarte! 💛');
  }

  const showQuicks = msgs.length <= 2;

  return (
    <div className="chat-widget">
      {/* Floating bubble hint */}
      {!open && showBubble && (
        <div className="chat-hint" onClick={() => { setOpen(true); setShowBubble(false); }}>
          <span>¿Necesitas ayuda? 💬</span>
          <button className="chat-hint-close" onClick={e => { e.stopPropagation(); setShowBubble(false); }} aria-label="Cerrar"><X size={11}/></button>
        </div>
      )}
      {/* Chat window */}
      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="chat-avatar"><Flower2 size={18} strokeWidth={1.2}/></div>
              <div><p className="chat-name">{BOT_NAME}</p><span className="chat-status"><span className="chat-dot"/>En línea</span></div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)} aria-label="Cerrar chat"><X size={16}/></button>
          </div>
          <div className="chat-body">
            {msgs.map((m, i) => (
              <div key={i} className={`chat-msg chat-msg-${m.from}`}>
                {m.from === 'bot' && <div className="chat-msg-avatar"><Bot size={13}/></div>}
                <div className="chat-bubble">
                  <p>{m.text}</p>
                  {m.action === 'whatsapp' && <a href={whatsapp} target="_blank" rel="noreferrer" className="chat-wa-btn"><MessageCircle size={13}/> Abrir WhatsApp</a>}
                </div>
              </div>
            ))}
            {typing && (
              <div className="chat-msg chat-msg-bot">
                <div className="chat-msg-avatar"><Bot size={13}/></div>
                <div className="chat-bubble chat-typing"><span/><span/><span/></div>
              </div>
            )}
            {showQuicks && !typing && (
              <div className="chat-quicks">
                {FAQ.map((f, i) => <button key={i} onClick={() => handleQuick(f)}>{f.q}</button>)}
              </div>
            )}
            <div ref={bottomRef}/>
          </div>
          <div className="chat-footer">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Escribe tu mensaje..." />
            <button onClick={handleSend} aria-label="Enviar"><Send size={15}/></button>
          </div>
        </div>
      )}
      {/* FAB button */}
      <button className={`chat-fab ${open ? 'chat-fab-open' : ''}`} onClick={() => { setOpen(o => !o); setShowBubble(false); }} aria-label="Abrir chat">
        {open ? <X size={22}/> : <MessageCircle size={22}/>}
        {!open && <span className="chat-fab-ping"/>}
      </button>
    </div>
  );
}

function App() {
  useReveal();
  return <>
    <Header />
    <main>
      {/* HERO */}
      <section className="hero" id="inicio">
        <div className="hero-image" role="img" aria-label="Ambiente sereno de un centro de bienestar" style={{backgroundImage:`url(${imgHero})`}} />
        <div className="hero-content">
          <span className="eyebrow" data-reveal="fade-up" style={{'--d':'0ms'}}><span className="eyebrow-line"/> BELLEZA · BIENESTAR · CUIDADO PERSONAL</span>
          <h1 data-reveal="fade-up" style={{'--d':'120ms'}}>Un momento para ti.<br/><em>Una forma de sentirte bien.</em></h1>
          <p data-reveal="fade-up" style={{'--d':'220ms'}}>Descubre un espacio pensado para reconectar contigo, cuidar de ti y disfrutar una experiencia de belleza personalizada.</p>
          <div className="hero-actions" data-reveal="fade-up" style={{'--d':'320ms'}}>
            <a className="button button-dark" href={whatsapp} target="_blank" rel="noreferrer">Agenda tu valoración <ArrowRight size={16}/></a>
            <a className="text-link" href="#tratamientos">Descubre nuestros tratamientos <ArrowUpRight size={15}/></a>
          </div>
          <div className="hero-note" data-reveal="fade-up" style={{'--d':'420ms'}}><span className="note-icon"><Sparkles size={17}/></span><span>Tu bienestar merece un espacio especial.</span></div>
        </div>
        <div className="hero-stamp"><span>UN ESPACIO</span><Flower2 size={25} strokeWidth={1}/><span>PARA TI</span></div>
      </section>

      {/* INTRO */}
      <section className="intro section-pad" id="nosotros">
        <div className="intro-label" data-reveal="fade-up"><span className="small-gold-line"/> CONÓCENOS</div>
        <div className="intro-copy">
          <h2 data-reveal="fade-right">La belleza empieza<br/><em>cuando te dedicas tiempo.</em></h2>
          <div className="intro-description" data-reveal="fade-left">
            <p>En Beauty Life creemos que cuidarte es una forma de escucharte. Creamos un ambiente cálido y cercano donde cada visita se adapta a tus necesidades y a tus objetivos personales.</p>
            <a className="underlined-link" href="#contacto">Conoce nuestro espacio <ArrowRight size={16}/></a>
          </div>
        </div>
      </section>

      {/* TREATMENTS */}
      <section className="treatments section-pad" id="tratamientos">
        <div className="section-heading" data-reveal="fade-up">
          <div><span className="eyebrow">NUESTRO ESPACIO DE CUIDADO</span><h2>Encuentra tu momento<br/><em>de bienestar.</em></h2></div>
          <p>Te acompañamos con atención personalizada para que conozcas las opciones que mejor se adaptan a ti.</p>
        </div>
        <div className="service-grid">
          <article className="service-card" data-reveal="fade-up" style={{'--d':'0ms',backgroundImage:`url(${imgS1})`}}>
            <div className="service-number">01</div>
            <div className="service-card-bottom"><span>01 / CUERPO</span><h3>Moldeamiento corporal</h3><a href={whatsapp} target="_blank" rel="noreferrer" aria-label="Consultar por moldeamiento corporal"><ArrowUpRight/></a></div>
          </article>
          <article className="service-card" data-reveal="fade-up" style={{'--d':'120ms',backgroundImage:`url(${imgS2})`}}>
            <div className="service-number">02</div>
            <div className="service-card-bottom"><span>02 / CUIDADO</span><h3>Drenaje postquirúrgico</h3><a href={whatsapp} target="_blank" rel="noreferrer" aria-label="Consultar por drenaje postquirúrgico"><ArrowUpRight/></a></div>
          </article>
          <article className="service-card" data-reveal="fade-up" style={{'--d':'240ms',backgroundImage:`url(${imgS3})`}}>
            <div className="service-number">03</div>
            <div className="service-card-bottom"><span>03 / BELLEZA</span><h3>Aparatología estética</h3><a href={whatsapp} target="_blank" rel="noreferrer" aria-label="Consultar por aparatología estética"><ArrowUpRight/></a></div>
          </article>
        </div>
        <p className="treatment-disclaimer" data-reveal="fade-up">Cada experiencia comienza con una conversación para conocer tus necesidades y orientarte de manera personalizada.</p>
      </section>

      {/* QUOTE */}
      <section className="quote-band" id="opiniones">
        <div className="quote-flower" data-reveal="fade-up"><Flower2 size={44} strokeWidth={0.8}/></div>
        <span className="eyebrow" data-reveal="fade-up" style={{'--d':'80ms'}}>UN RECORDATORIO PARA TI</span>
        <blockquote data-reveal="fade-up" style={{'--d':'160ms'}}>"Tu belleza no se trata de ser perfecta,<br className="desktop-break"/> sino de sentirte bien contigo misma."</blockquote>
        <p data-reveal="fade-up" style={{'--d':'240ms'}}>Regálate un momento para ti. Tu bienestar también merece ser una prioridad.</p>
        <span className="quote-rule" data-reveal="fade-up" style={{'--d':'320ms'}}/>
      </section>

      {/* VISIT / CONTACT */}
      <section className="visit-section section-pad" id="contacto">
        <div className="visit-copy" data-reveal="fade-right">
          <span className="eyebrow">ESTAMOS PARA ACOMPAÑARTE</span>
          <h2>Tu próximo momento<br/><em>de bienestar comienza aquí.</em></h2>
          <p>Estamos listas para ayudarte a conocer nuestros tratamientos y encontrar la opción adecuada para ti.</p>
          <a className="button button-dark" href={whatsapp} target="_blank" rel="noreferrer">Agenda tu valoración por WhatsApp <ArrowRight size={16}/></a>
        </div>
        <div className="visit-image" role="img" aria-label="Detalle sereno de un espacio de cuidado personal" data-reveal="fade-left" style={{backgroundImage:`linear-gradient(0deg,rgba(40,29,21,.3),transparent 50%),url(${imgHero})`}}>
          <div className="visit-image-caption"><span>BEAUTY LIFE</span><span>Un espacio dedicado a ti</span></div>
        </div>
      </section>
    </main>

    <footer className="site-footer" id="footer">
      <div className="footer-main">
        <div className="footer-brand-column" data-reveal="fade-up">
          <Brand footer/>
          <p className="footer-description">Un espacio dedicado al bienestar, la belleza y el cuidado personal. Te acompañamos con atención personalizada para que cada visita sea una experiencia especial.</p>
          <div className="footer-brand-note"><Heart size={15} strokeWidth={1.4}/><span>Un espacio para reconectar contigo.</span></div>
        </div>
        <div className="footer-column" data-reveal="fade-up" style={{'--d':'80ms'}}>
          <h3>Explora</h3><a href="#inicio">Inicio</a><a href="#nosotros">Nosotros</a><a href="#tratamientos">Tratamientos</a><a href="#opiniones">Opiniones</a><a href="#contacto">Contacto</a>
        </div>
        <div className="footer-column treatments-links" data-reveal="fade-up" style={{'--d':'160ms'}}>
          <h3>Nuestros tratamientos</h3>
          <a href={whatsapp} target="_blank" rel="noreferrer">Moldeamiento corporal</a>
          <a href={whatsapp} target="_blank" rel="noreferrer">Reducción de medidas sin cirugía</a>
          <a href={whatsapp} target="_blank" rel="noreferrer">Drenaje postquirúrgico</a>
          <a href={whatsapp} target="_blank" rel="noreferrer">Aparatología estética</a>
          <a href={whatsapp} target="_blank" rel="noreferrer">Asesoramiento cosmético</a>
        </div>
        <div className="footer-column contact-column" data-reveal="fade-up" style={{'--d':'240ms'}}>
          <h3>Contáctanos</h3>
          <a className="contact-link" href={whatsapp} target="_blank" rel="noreferrer"><span className="contact-icon"><MessageCircle size={16}/></span><span>WhatsApp<strong>+593 99 927 2654</strong></span></a>
          <a className="contact-link" href="mailto:soybeautylife@gmail.com"><span className="contact-icon"><Mail size={16}/></span><span>Email<strong>soybeautylife@gmail.com</strong></span></a>
          <a className="contact-link address-link" href={mapLink} target="_blank" rel="noreferrer"><span className="contact-icon"><MapPin size={16}/></span><span>Dirección<strong>{address}</strong></span></a>
          <div className="social-row">
            <a href="https://www.instagram.com/beauty.life.ec/" target="_blank" rel="noreferrer" aria-label="Instagram de Beauty Life"><Instagram size={17}/></a>
            <a href="https://www.facebook.com/centroesteticoquitoec/" target="_blank" rel="noreferrer" aria-label="Facebook de Beauty Life"><Facebook size={17}/></a>
            <a href="https://linktr.ee/beautylife.ec" target="_blank" rel="noreferrer" aria-label="Linktree de Beauty Life"><ArrowUpRight size={17}/></a>
            <span className="social-label">Síguenos</span>
          </div>
        </div>
      </div>
      <div className="footer-quote">
        <div className="quote-side-mark"><Flower2 size={25} strokeWidth={1}/></div>
        <div><span className="eyebrow">UN PENSAMIENTO PARA LLEVAR CONTIGO</span><p>"Tu belleza no se trata de ser perfecta, sino de sentirte bien contigo misma."</p><span className="footer-quote-support">Regálate un momento para ti. Tu bienestar también merece ser una prioridad.</span></div>
        <div className="quote-decoration">BL<span>✳</span></div>
      </div>
      <div className="footer-bottom"><p>© {year} BEAUTY LIFE CENTRO ESTÉTICO. Todos los derechos reservados.</p><a className="developer-credit" href="https://www.tcpitsolution.in/" target="_blank" rel="noreferrer"><span>Powered by</span> <strong>TCP IT Solution</strong><ArrowUpRight size={13}/></a></div>
    </footer>
    <ChatWidget />
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
