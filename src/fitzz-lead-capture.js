/* Fitzz lead capture v1.0.2 — vanilla custom element. No credentials or storage. */
import { isValidFormId } from './lead-capture-config.js';

(() => {
  'use strict';
  if (customElements.get('fitzz-lead-capture')) return;
  const VERSION = '1.0.2';
  const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const CLICK_KEYS = ['gclid', 'gbraid', 'wbraid'];
  const PRODUCTS = [
    { id: 'urban-350', label: 'KIT URBAN-350' }, { id: 'delivery-400', label: 'KIT DELIVERY-400' },
    { id: 'force-500', label: 'KIT FORCE-500' }, { id: 'fat-500', label: 'KIT FAT-500' },
    { id: 'turbo-750', label: 'KIT TURBO-750' }, { id: 'help', label: 'Preciso de ajuda para escolher' }
  ];
  const DEFAULTS = {
    products: PRODUCTS, captureAttribution: false, trackingAuthorized: false,
    measurementChoices: { analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', ad_storage: 'denied', version: null },
    autoRedirect: false, timeoutMs: 12000, pollIntervalMs: 2000, maxPollingMs: 30000, maxPollAttempts: 8,
    communicationTextVersion: 'draft-v01', privacyNoticeVersion: 'draft-v01',
    texts: {
      eyebrow: 'Converse com a Fitzz', title: 'Encontre o kit para a sua bicicleta.',
      description: 'Conte o que você procura e continue o atendimento no WhatsApp.',
      optin: 'Aceito receber comunicações futuras da Fitzz.',
      privacyNote: 'Vamos usar estes dados para registrar sua solicitação de atendimento.',
      submit: 'Continuar no WhatsApp', launcher: 'Falar com a Fitzz'
    }
  };
  const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clamp = (value, fallback, min, max) => Number.isFinite(Number(value)) ? Math.max(min, Math.min(max, Number(value))) : fallback;
  const containsPII = value => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value) || /(?:\+?\d[\s().-]*){10,}/.test(value);
  const hasControlChars = value => Array.from(value).some(character => {
    const code = character.charCodeAt(0);
    return code < 32 || code === 127;
  });
  const safeHttpUrl = value => {
    try {
      const u = new URL(value, document.baseURI);
      const local = ['localhost', '127.0.0.1', '[::1]'].includes(u.hostname);
      if (u.username || u.password || (u.protocol !== 'https:' && !(local && u.protocol === 'http:'))) return null;
      return u;
    } catch { return null; }
  };
  function randomKey() {
    if (crypto.randomUUID) return crypto.randomUUID();
    const bytes = new Uint8Array(24); crypto.getRandomValues(bytes);
    return Array.from(bytes, x => x.toString(16).padStart(2, '0')).join('');
  }
  function phone(value) {
    const raw = value.trim(); let digits = raw.replace(/\D/g, '');
    if (!raw.startsWith('+') && (digits.length === 10 || digits.length === 11)) digits = `55${digits}`;
    if (!/^[1-9]\d{7,14}$/.test(digits) || /^(\d)\1+$/.test(digits)) return null;
    if (digits.startsWith('55') && !/^55[1-9]\d\d{8,9}$/.test(digits)) return null;
    return `+${digits}`;
  }
  const CSS = `
    :host { display:block; font-family:Montserrat,Arial,sans-serif; color:#211F1F; line-height:1.5; color-scheme:light; text-align:left; font-size:16px; }
    *,*::before,*::after { box-sizing:border-box; } [hidden] { display:none!important; }
    button,input,select,a { font:inherit; } button,a,input,select { -webkit-tap-highlight-color:transparent; }
    button { cursor:pointer; } button:disabled { cursor:wait; opacity:.72; }
    button:focus-visible,a:focus-visible { outline:3px solid #68773C; outline-offset:4px; }
    .panel { background:#FFF; border:1px solid #C7E088; border-radius:18px; overflow:hidden; max-width:620px; margin:0 auto; }
    .intro { padding:28px 28px 22px; border-top:6px solid #A8CF45; background:#FFF; }
    .eyebrow { color:#4D5238; font-size:12px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; margin:0 0 12px; }
    h2 { font-size:clamp(24px,4vw,32px); line-height:1.15; letter-spacing:-.035em; font-weight:800; margin:0 0 14px; padding-right:12px; }
    .description { font-size:14px; color:#383535; margin:0; max-width:46ch; }
    form { padding:0 28px 28px; } .fields { display:grid; grid-template-columns:1fr 1fr; gap:17px 16px; }
    .field.wide { grid-column:1/-1; } label { display:block; font-size:13px; font-weight:600; margin-bottom:7px; }
    input,select { display:block; width:100%; min-width:0; height:48px; border:1px solid #68773C; border-radius:7px; padding:10px 12px; font-size:16px; color:#211F1F; background:#FFF; }
    input:focus,select:focus { outline:2px solid #68773C; outline-offset:2px; }
    input[aria-invalid=true],select[aria-invalid=true] { border-width:2px; border-color:#383535; }
    input:disabled,select:disabled { background:#F5F6F1; color:#383535; opacity:1; }
    .hint { color:#4D5238; font-size:11px; margin:5px 0 0; }
    .error { font-size:12px; font-weight:600; color:#383535; margin:6px 0 0; min-height:0; }
    .optin { display:flex; gap:10px; align-items:flex-start; margin:20px 0 0; font-size:12px; font-weight:400; }
    .optin input { width:19px; height:19px; flex:0 0 19px; margin:1px 0 0; padding:0; accent-color:#4D5238; }
.privacy { font-size:11px; color:#383535; margin:13px 0 20px; }
    .privacy a { color:#4D5238; text-underline-offset:3px; font-weight:600; }
    .primary,.continue { display:flex; justify-content:center; align-items:center; gap:12px; width:100%; min-height:50px; border:0; border-radius:8px; padding:12px 14px; background:#A8CF45; color:#211F1F; text-decoration:none; font-size:14px; font-weight:600; }
    .primary:hover:not(:disabled),.continue:hover { background:#C7E088; }
    .status { margin:16px 0 0; padding:12px 14px; border-left:3px solid #68773C; background:#F5F6F1; font-size:13px; }
    .status:empty { display:none; } .secondary { background:transparent; border:1px solid #68773C; color:#383535; border-radius:7px; padding:10px 14px; margin-top:12px; font-size:13px; width:100%; }
    .continue { margin-top:12px; }
    .launcher { position:fixed; right:max(20px,env(safe-area-inset-right)); bottom:max(20px,env(safe-area-inset-bottom)); z-index:2147482000; display:grid; place-items:center; width:64px; height:64px; min-height:64px; padding:12px; border:2px solid #FFF; border-radius:50%; background:#25D366; color:#FFF; box-shadow:0 6px 20px #211f1f25; }
    .launcher:hover { filter:brightness(.94); } .launcher:focus-visible { outline-color:#128C7E; } .launcher svg { width:34px; height:34px; }
    dialog { padding:0; border:0; border-radius:18px; background:#FFF; width:min(540px,calc(100vw - 24px)); max-width:540px; max-height:calc(100dvh - 32px); overflow:auto; color:#211F1F; overscroll-behavior:contain; }
    dialog::backdrop { background:#211F1F99; } dialog .panel { border:0; } .close { position:absolute; top:16px; right:14px; display:grid; place-items:center; width:36px; height:36px; border:0; background:#F5F6F1; color:#383535; border-radius:50%; font-size:24px; line-height:1; }
    dialog h2 { padding-right:27px; } :host([mode=floating]) { display:contents; }
    @media(max-width:480px) { .intro { padding:25px 20px 20px; } form { padding:0 20px 22px; } .fields { grid-template-columns:1fr; gap:15px; } .field.wide { grid-column:auto; } .launcher { right:max(14px,env(safe-area-inset-right)); bottom:max(14px,env(safe-area-inset-bottom)); padding:12px; } }
    @media(max-width:480px),(pointer:coarse) { .close { width:44px; height:44px; } }
    @media(prefers-reduced-motion:no-preference) { .launcher,.primary,.continue { transition:background .15s ease; } }
  `;
  // WhatsApp silhouette from Simple Icons; source recorded in docs/validacao.md.
  const whatsappIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';

  class FitzzLeadCapture extends HTMLElement {
    static get observedAttributes() { return ['mode', 'webhook-url', 'status-url', 'capture-point', 'form-id', 'privacy-url', 'whatsapp-number']; }
    constructor() {
      super(); this.attachShadow({ mode: 'open' });
      this.config = { ...DEFAULTS, texts: { ...DEFAULTS.texts }, measurementChoices: { ...DEFAULTS.measurementChoices }, products: PRODUCTS.map(p => ({ ...p })) };
      this._state = 'idle'; this._busy = false; this._locked = false; this._attempt = null; this._receipt = null; this._token = null;
      this._timers = new Set(); this._requestController = null; this._pollCount = 0; this._pollStarted = 0; this._cooldownUntil = 0;
      this._onVisibility = () => { if (document.hidden) this._stopPoll(); else if (this._state === 'pending') this._showCheck(); };
    }
    connectedCallback() {
      if (!this._landingPage) this._landingPage = location.href;
      if (!this._rendered) this._render();
      document.addEventListener('visibilitychange', this._onVisibility);
      this._refreshAvailability();
    }
    disconnectedCallback() {
      document.removeEventListener('visibilitychange', this._onVisibility); this._stopPoll();
      if (this._requestController) this._requestController.abort();
      for (const timer of this._timers) clearTimeout(timer); this._timers.clear();
    }
    attributeChangedCallback(name, oldValue, value) {
      if (oldValue === value || !this._rendered) return;
      if (name === 'privacy-url') { this._refreshPrivacy(); return; }
      if (this._attempt && this._locked) return;
      if (name === 'mode') { this._rendered = false; this._render(); } else this._refreshAvailability();
    }
    configure(options = {}) {
      if (this._attempt && this._locked) throw new Error('Não altere a configuração enquanto houver um cadastro em andamento.');
      const prior = this._readFields();
      this._attempt = null; this._attemptEndpoint = null; this._statusEndpoint = null; this._receipt = null; this._token = null;
      const products = options.products || this.config.products;
      if (!Array.isArray(products) || products.length === 0 || products.length > 60 || products.some(p => !p || !/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(p.id) || typeof p.label !== 'string' || !p.label.trim() || p.label.length > 100) || new Set(products.map(p => p.id)).size !== products.length) throw new Error('Configure um catálogo válido com IDs únicos.');
      const c = { ...this.config, ...options, products: products.map(p => ({ id: p.id, label: p.label })), texts: { ...this.config.texts, ...(options.texts || {}) }, measurementChoices: { ...this.config.measurementChoices, ...(options.measurementChoices || {}) } };
      for (const key of ['analytics_storage', 'ad_user_data', 'ad_personalization', 'ad_storage']) if (!['unknown', 'granted', 'denied'].includes(c.measurementChoices[key])) c.measurementChoices[key] = 'denied';
      c.timeoutMs = clamp(c.timeoutMs, 12000, 100, 30000); c.pollIntervalMs = clamp(c.pollIntervalMs, 2000, 100, 15000);
      c.maxPollingMs = clamp(c.maxPollingMs, 30000, 100, 60000); c.maxPollAttempts = clamp(c.maxPollAttempts, 8, 1, 20);
      c.captureAttribution = c.captureAttribution === true; c.trackingAuthorized = c.trackingAuthorized === true; c.autoRedirect = c.autoRedirect === true;
      c.measurementChoices = Object.fromEntries(['analytics_storage', 'ad_user_data', 'ad_personalization', 'ad_storage'].map(key => [key, c.measurementChoices[key]]));
      c.measurementChoices.version = typeof options.measurementChoices?.version === 'string' ? options.measurementChoices.version.slice(0, 80) : this.config.measurementChoices.version;
      this.config = c; this._rendered = false; if (this.isConnected) { this._render(); this._restoreFields(prior); this._refreshAvailability(); }
      return this;
    }
    get state() { return this._state; }
    setMeasurementChoices(choices = {}, tracking = {}) {
      const keys = ['analytics_storage', 'ad_storage', 'ad_user_data', 'ad_personalization'];
      this.config.measurementChoices = Object.fromEntries(keys.map(key => [key, ['granted', 'denied', 'unknown'].includes(choices[key]) ? choices[key] : 'denied']));
      this.config.measurementChoices.version = typeof choices.version === 'string' ? choices.version.slice(0, 80) : null;
      this.config.captureAttribution = tracking.captureAttribution === true;
      this.config.trackingAuthorized = tracking.trackingAuthorized === true;
      return this;
    }
    selectProduct(productId) {
      if (this._locked || !this._rendered || typeof productId !== 'string' || !this.config.products.some(p => p.id === productId)) return false;
      this._el('product_id').value = productId;
      // Uma tentativa rejeitada pode ser editada. Não reutilize seu snapshot.
      this._attempt = null; this._attemptEndpoint = null; this._statusEndpoint = null;
      this._receipt = null; this._token = null;
      this._error('product_id', ''); this._setState('idle', '');
      return true;
    }
    open() {
      const dialog = this.shadowRoot.querySelector('dialog'); if (!dialog || dialog.open) return;
      this._restoreFocus = this.shadowRoot.activeElement || document.activeElement;
      dialog.showModal(); (this._locked ? this.shadowRoot.querySelector('.close') : this._el('full_name')).focus();
    }
    close() { const d = this.shadowRoot.querySelector('dialog'); if (d && d.open) d.close(); }
    _el(id) { return this.shadowRoot.getElementById(id); }
    _timer(fn, ms) { const t = setTimeout(() => { this._timers.delete(t); fn(); }, ms); this._timers.add(t); return t; }
    _render() {
      const t = this.config.texts;
      const field = (name, label, type, attrs = '', wide = false) => `<div class="field ${wide ? 'wide' : ''}"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" ${attrs} required aria-describedby="${name}-error"><p class="error" id="${name}-error"></p></div>`;
      const privacyUrl = this.getAttribute('privacy-url') ? safeHttpUrl(this.getAttribute('privacy-url')) : null;
      const panel = `<section class="panel"><header class="intro"><p class="eyebrow">${esc(t.eyebrow)}</p><h2 id="capture-title">${esc(t.title)}</h2><p class="description">${esc(t.description)}</p></header><form novalidate><div class="fields">${field('full_name', 'Nome', 'text', 'autocomplete="name" maxlength="100"', true)}${field('email', 'Email', 'email', 'autocomplete="email" maxlength="254"')}${field('whatsapp', 'WhatsApp', 'tel', 'autocomplete="tel" inputmode="tel" maxlength="24" placeholder="DDD + número"')}<div class="field wide"><label for="product_id">Produto de interesse</label><select id="product_id" name="product_id" required aria-describedby="product_id-error"><option value="">Selecione o produto</option>${this.config.products.map(p => `<option value="${esc(p.id)}">${esc(p.label)}</option>`).join('')}</select><p class="error" id="product_id-error"></p></div></div><label class="optin" for="communication_optin"><input type="checkbox" id="communication_optin" name="communication_optin"><span>${esc(t.optin)}</span></label><p class="privacy">${esc(t.privacyNote)}${privacyUrl ? ` <a href="${esc(privacyUrl.href)}" target="_blank" rel="noopener noreferrer">Política de privacidade</a>` : ''}</p><button class="primary" type="submit">${esc(t.submit)} <span aria-hidden="true">↗</span></button><p class="status" id="form-status" role="status" aria-live="polite" aria-atomic="true" tabindex="-1"></p><button type="button" class="secondary" id="check-status" hidden>Consultar cadastro</button><a class="continue" id="continue-whatsapp" hidden rel="noopener noreferrer">Abrir WhatsApp <span aria-hidden="true">↗</span></a></form></section>`;
      const floating = this.getAttribute('mode') === 'floating';
      this.shadowRoot.innerHTML = `<style>${CSS}</style>${floating ? `<button type="button" class="launcher" id="launcher" aria-label="${esc(t.launcher)}" title="${esc(t.launcher)}" aria-haspopup="dialog" aria-controls="capture-dialog">${whatsappIcon}</button><dialog id="capture-dialog" aria-labelledby="capture-title"><button type="button" class="close" aria-label="Fechar formulário">×</button>${panel}</dialog>` : panel}`;
      this._rendered = true;
      this.shadowRoot.querySelector('form').addEventListener('submit', e => { e.preventDefault(); this._submit(); });
      this.shadowRoot.querySelectorAll('input,select').forEach(input => input.addEventListener('input', () => {
        if (!this._locked) {
          this._attempt = null; this._attemptEndpoint = null; this._statusEndpoint = null; this._receipt = null; this._token = null;
          this._error(input.name, ''); this._setState('idle', '');
        }
      }));
      this._el('check-status').addEventListener('click', () => { this._pollCount = 0; this._pollStarted = Date.now(); if (this._canPoll()) this._poll(); else this._submit(); });
      if (floating) {
        this._el('launcher').addEventListener('click', () => this.open());
        this.shadowRoot.querySelector('.close').addEventListener('click', () => this.close());
        this._el('capture-dialog').addEventListener('close', () => { if (this._restoreFocus && this._restoreFocus.isConnected) this._restoreFocus.focus(); });
        this._el('capture-dialog').addEventListener('keydown', event => {
          if (event.key !== 'Tab') return;
          const dialog = this._el('capture-dialog');
          const focusable = Array.from(dialog.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),a[href],[tabindex]:not([tabindex="-1"])'))
            .filter(el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden');
          if (!focusable.length) { event.preventDefault(); return; }
          const active = this.shadowRoot.activeElement;
          const first = focusable[0], last = focusable[focusable.length - 1];
          if (!focusable.includes(active) || (event.shiftKey && active === first) || (!event.shiftKey && active === last)) {
            event.preventDefault(); (event.shiftKey ? last : first).focus();
          }
        });
      }
      this._applyLocks();
    }
    _readFields() {
      if (!this._rendered) return null;
      return { full_name: this._el('full_name').value, email: this._el('email').value, whatsapp: this._el('whatsapp').value, product_id: this._el('product_id').value, communication_optin: this._el('communication_optin').checked };
    }
    _restoreFields(values) { if (values) for (const key of ['full_name', 'email', 'whatsapp', 'product_id']) this._el(key).value = values[key] || ''; if (values) this._el('communication_optin').checked = values.communication_optin === true; }
    _error(key, message) {
      const input = this._el(key), el = this._el(`${key}-error`); if (!input || !el) return;
      el.textContent = typeof message === 'string' ? message.slice(0, 180) : '';
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
    }
    _validate() {
      const v = this._readFields(); const errors = {};
      v.full_name = v.full_name.trim(); v.email = v.email.trim();
      if (v.full_name.length < 2 || v.full_name.length > 100 || hasControlChars(v.full_name)) errors.full_name = 'Informe seu nome, com 2 a 100 caracteres.';
      if (!v.email || this._el('email').validity.typeMismatch || /\s/.test(v.email) || v.email.length > 254) errors.email = 'Informe um email válido.';
      const normalized = phone(v.whatsapp); if (!normalized) errors.whatsapp = 'Informe seu WhatsApp com DDD. Para outro país, inclua + e o código do país.';
      if (!this.config.products.some(p => p.id === v.product_id)) errors.product_id = 'Selecione um produto ou peça ajuda para escolher.';
      for (const key of ['full_name', 'email', 'whatsapp', 'product_id']) this._error(key, errors[key] || '');
      if (Object.keys(errors).length) { this._el(Object.keys(errors)[0]).focus(); this._setState('invalid', 'Confira os campos indicados antes de continuar.'); return null; }
      v.whatsapp = normalized; return v;
    }
    _safePage(raw) {
      try {
        const u = new URL(raw); if (!['https:', 'http:'].includes(u.protocol)) return null;
        u.username = ''; u.password = ''; u.hash = '';
        u.pathname = u.pathname.split('/').map(part => { let decoded = part; try { decoded = decodeURIComponent(part); } catch { /* Mantém o segmento original inválido. */ } return containsPII(decoded) ? 'redacted' : part; }).join('/');
      const keep = new URLSearchParams();
        if (this.config.captureAttribution) for (const key of UTM_KEYS) { const value = u.searchParams.get(key); if (value && value.length <= 200 && !containsPII(value)) keep.set(key, value); }
        u.search = keep.toString(); return u.href.length <= 2048 ? u.href : `${u.origin}/`;
      } catch { return null; }
    }
    _metadata() {
      const p = new URL(location.href); const c = this.config;
      const result = { form_id: this.getAttribute('form-id') || null, form_version: VERSION, capture_point: this.getAttribute('capture-point') || (this.getAttribute('mode') === 'floating' ? 'site_floating' : 'landing_inline'), landing_page: this._safePage(this._landingPage || location.href), capture_page: this._safePage(location.href), referrer_domain: null, communication_text_version: c.communicationTextVersion, privacy_notice_version: c.privacyNoticeVersion, measurement_choices: { ...c.measurementChoices } };
      if (c.captureAttribution && document.referrer) { try { result.referrer_domain = new URL(document.referrer).hostname; } catch { /* Referrer inválido não é enviado. */ } }
      for (const key of UTM_KEYS) { const value = p.searchParams.get(key); result[key] = c.captureAttribution && value && value.length <= 200 && !containsPII(value) ? value : null; }
      for (const key of CLICK_KEYS) { const value = p.searchParams.get(key); result[key] = c.captureAttribution && c.trackingAuthorized && c.measurementChoices.ad_user_data === 'granted' && value && value.length <= 2048 && !/[\s]/.test(value) && !hasControlChars(value) ? value : null; }
      return result;
    }
    _endpoint(attribute) {
      if (attribute === 'webhook-url' && !isValidFormId(this.getAttribute('form-id'))) return null;
      const value = this.getAttribute(attribute); return value ? safeHttpUrl(value) : null;
    }
    _refreshPrivacy() {
      const container = this.shadowRoot.querySelector('.privacy'); if (!container) return;
      container.textContent = this.config.texts.privacyNote;
      const value = this.getAttribute('privacy-url'); const url = value ? safeHttpUrl(value) : null;
      if (url) {
        const link = document.createElement('a'); link.href = url.href; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'Política de privacidade';
        container.append(document.createTextNode(' '), link);
      }
    }
    _refreshAvailability() {
      if (!this._rendered) return;
      if (!this._endpoint('webhook-url') && !this._attempt) this._setState('unavailable', 'O cadastro está indisponível no momento. Aguarde a disponibilização do atendimento.');
      else if (this._state === 'unavailable') this._setState('idle', '');
      this._applyLocks();
    }
    _applyLocks() {
      if (!this._rendered) return;
      this.shadowRoot.querySelectorAll('input,select').forEach(e => { e.disabled = this._locked; });
      const button = this.shadowRoot.querySelector('[type=submit]');
      button.disabled = this._busy || this._state === 'confirmed' || this._state === 'conflict' || Date.now() < this._cooldownUntil;
      button.setAttribute('aria-busy', this._busy ? 'true' : 'false');
      button.textContent = this._busy ? 'Registrando…' : this._state === 'confirmed' ? 'Cadastro confirmado' : this._locked ? 'Tentar confirmar cadastro' : this.config.texts.submit;
    }
    _setState(status, message) {
      this._state = status; if (this._rendered) { this._el('form-status').textContent = message; this._applyLocks(); }
      this.dispatchEvent(new CustomEvent('fitzz-lead-state', { detail: { status }, bubbles: true, composed: true }));
    }
    async _fetch(url, options) {
      const controller = new AbortController(); this._requestController = controller;
      const timeout = this._timer(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await fetch(url, { ...options, mode: 'cors', credentials: 'omit', referrerPolicy: 'no-referrer', redirect: 'error', signal: controller.signal });
        let body; try { body = await response.json(); } catch (error) { if (controller.signal.aborted) throw error; body = null; }
        return { status: response.status, ok: response.ok, headers: response.headers, body };
      }
      finally { clearTimeout(timeout); this._timers.delete(timeout); if (this._requestController === controller) this._requestController = null; }
    }
    async _submit() {
      if (this._busy || ['confirmed', 'conflict'].includes(this._state) || Date.now() < this._cooldownUntil) return;
      if (this._locked && this._canPoll()) { this._pollCount = 0; this._pollStarted = Date.now(); return this._poll(); }
      const endpoint = this._attemptEndpoint || this._endpoint('webhook-url');
      if (!endpoint) { this._setState('unavailable', 'O cadastro está indisponível no momento. Seus dados não foram enviados.'); return; }
      if (!this._attempt) {
        const values = this._validate(); if (!values) return;
        this._attempt = Object.freeze({ ...values, ...this._metadata(), idempotency_key: randomKey() });
        this._attemptEndpoint = endpoint; this._statusEndpoint = this._endpoint('status-url');
      }
      this._locked = true; this._busy = true; this._stopPoll(); this._el('check-status').hidden = true;
      this._setState('submitting', 'Estamos registrando seus dados. Aguarde a confirmação.');
      try {
        const response = await this._fetch(endpoint.href, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(this._attempt) });
        await this._handleResponse(response, false);
      } catch { this._setState('uncertain', 'Não foi possível confirmar o cadastro. Tente confirmar novamente; manteremos os mesmos dados para evitar um envio duplicado.'); }
      finally { this._busy = false; this._applyLocks(); if (this._state === 'pending') this._schedulePoll(); }
    }
    _retrySeconds(response, body) {
      const header = response.headers.get('Retry-After'); let seconds = Number(body.retryAfter);
      if (header) { const numeric = Number(header); seconds = Number.isFinite(numeric) ? numeric : Math.ceil((Date.parse(header) - Date.now()) / 1000); }
      return clamp(seconds, 3, .1, 300);
    }
    async _handleResponse(response, fromPoll) {
      const body = response.body;
      if (response.status === 429) {
        const delay = this._retrySeconds(response, body || {}); this._cooldownUntil = Date.now() + delay * 1000;
        this._setState(fromPoll ? 'pending' : 'uncertain', `Aguarde ${Math.ceil(delay)} segundos antes de tentar confirmar novamente.`);
        this._timer(() => { this._applyLocks(); this._showCheck(); }, delay * 1000); return;
      }
      if (!body || typeof body !== 'object') throw new Error('invalid-contract');
      if (response.status === 422 && !fromPoll) {
        this._locked = false; const errors = body.errors || body.field_errors || {}; let first;
        for (const key of ['full_name', 'email', 'whatsapp', 'product_id']) { const message = errors[key]; if (message) { this._error(key, Array.isArray(message) ? String(message[0]) : String(message)); first ||= key; } }
        this._setState('invalid', 'Confira os campos indicados. O cadastro não foi confirmado.'); if (first) this._el(first).focus(); return;
      }
      if (response.status === 409) { this._setState('conflict', 'Não foi possível confirmar esta solicitação com segurança. Aguarde a verificação do atendimento.'); this._showCheck(); return; }
      if (!response.ok) throw new Error('not-confirmed');
      if (response.status === 200 && body.status === 'confirmed') {
        const wa = this._whatsappUrl(body.waUrl); if (!wa) throw new Error('invalid-whatsapp');
        this._stopPoll(); const link = this._el('continue-whatsapp'); link.href = wa; link.hidden = false; this._el('check-status').hidden = true;
        this._setState('confirmed', 'Cadastro confirmado. Abra o WhatsApp e envie a mensagem para iniciar a conversa.');
        this._el('form-status').focus({ preventScroll: true });
        if (this.config.autoRedirect && this.isConnected) window.location.assign(wa);
        return;
      }
      if ((response.status === 202 || (fromPoll && response.status === 200)) && body.status === 'pending') {
        const token = body.token || (body.receipt && typeof body.receipt === 'object' && body.receipt.token) || (fromPoll ? this._token : null);
        const receipt = (typeof body.receipt === 'string' ? body.receipt : body.receipt && body.receipt.id) || (fromPoll ? this._receipt : null);
        // Entropy, scope and expiry are server responsibilities; reject header/control characters here.
        if (typeof token !== 'string' || !/^[A-Za-z0-9._~-]{1,2048}$/.test(token) || typeof receipt !== 'string' || !/^[A-Za-z0-9._~-]{1,200}$/.test(receipt)) throw new Error('invalid-receipt');
        this._receipt = receipt; this._token = token; this._retryAfter = this._retrySeconds(response, body) * 1000;
        this._setState('pending', 'Estamos registrando seus dados. Você poderá abrir o WhatsApp após a confirmação.'); this._showCheck(); return;
      }
      throw new Error('invalid-contract');
    }
    _whatsappUrl(raw) {
      if (typeof raw !== 'string') return null;
      try {
        const u = new URL(raw); if (u.protocol !== 'https:' || u.hostname !== 'wa.me' || u.port || u.username || u.password || u.hash || !/^\/[1-9]\d{7,14}\/?$/.test(u.pathname) || Array.from(u.searchParams.keys()).some(k => k !== 'text')) return null;
        const number = u.pathname.replace(/\//g, ''); const restricted = this.getAttribute('whatsapp-number');
        if (restricted && restricted.replace(/\D/g, '') !== number) return null;
        const product = this.config.products.find(p => p.id === this._attempt.product_id);
        u.search = ''; u.pathname = `/${number}`;
        // Rebuild text exclusively from configured catalogue. Never carry server PII/query fields.
        u.searchParams.set('text', `Olá, tenho interesse em ${product ? product.label : 'um kit Fitzz'} e gostaria de orientação.`);
        return u.href;
      } catch { return null; }
    }
    _canPoll() { return !!(this._token && this._receipt && this._statusEndpoint); }
    _showCheck() { if (this._rendered && this._state !== 'confirmed') this._el('check-status').hidden = !this._locked || this._busy; }
    _stopPoll() { if (this._pollTimer) { clearTimeout(this._pollTimer); this._timers.delete(this._pollTimer); this._pollTimer = null; } }
    _schedulePoll() {
      this._showCheck(); if (!this._canPoll() || !this.isConnected || document.hidden || this._busy) return;
      if (!this._pollStarted) this._pollStarted = Date.now();
      if (this._pollCount >= this.config.maxPollAttempts || Date.now() - this._pollStarted >= this.config.maxPollingMs) { this._el('form-status').textContent = 'O cadastro ainda está em verificação. Use “Consultar cadastro” para conferir novamente.'; return; }
      const delay = Math.max(this.config.pollIntervalMs, this._retryAfter || 0, this._cooldownUntil - Date.now());
      if (Date.now() + delay - this._pollStarted >= this.config.maxPollingMs) { this._showCheck(); return; }
      this._pollTimer = this._timer(() => this._poll(), delay);
    }
    async _poll() {
      if (this._busy || !this._canPoll() || !this.isConnected || document.hidden || Date.now() < this._cooldownUntil || Date.now() - this._pollStarted >= this.config.maxPollingMs) return;
      this._busy = true; this._pollCount++; this._el('check-status').hidden = true; this._applyLocks();
      try {
        const response = await this._fetch(this._statusEndpoint.href, { method: 'GET', headers: { Accept: 'application/json', Authorization: `Bearer ${this._token}`, 'X-Lead-Receipt': this._receipt } });
        await this._handleResponse(response, true);
      } catch { this._setState('pending', 'Ainda não foi possível consultar a confirmação. Seus dados continuam em verificação.'); }
      finally { this._busy = false; this._applyLocks(); if (this._state === 'pending') this._schedulePoll(); else this._showCheck(); }
    }
  }
  customElements.define('fitzz-lead-capture', FitzzLeadCapture);
})();
