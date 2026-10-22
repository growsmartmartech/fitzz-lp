import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  DEFAULT_CONSENT,
  consentUpdateEvent,
  leadConfirmedEvent,
  normalizeConsent,
  readConsent,
  saveConsent,
  toCapturePolicy,
  toMeasurementChoices,
} from '../src/consent.js';
import { isCaptureConfigReady, isValidFormId } from '../src/lead-capture-config.js';

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

test('sem decisão explícita, o envio e a medição ficam desconhecidos e sem atribuição', () => {
  assert.deepEqual(normalizeConsent(null), DEFAULT_CONSENT);
  assert.deepEqual(toMeasurementChoices(DEFAULT_CONSENT), {
    analytics_storage: 'unknown',
    ad_storage: 'unknown',
    ad_user_data: 'unknown',
    ad_personalization: 'unknown',
    version: null,
  });
  assert.deepEqual(toCapturePolicy(DEFAULT_CONSENT), {
    captureAttribution: false,
    trackingAuthorized: false,
  });
  assert.equal(leadConfirmedEvent('confirmed', 'landing_inline', {
    analytics: true, advertising: true, decided: false,
  }), null);
});

test('salva e recupera escolhas independentes de Analytics e Publicidade', () => {
  const storage = memoryStorage();
  const saved = saveConsent(storage, { analytics: true, advertising: false });
  assert.equal(storage.getItem(CONSENT_STORAGE_KEY) !== null, true);
  assert.deepEqual(readConsent(storage), { analytics: true, advertising: false, decided: true });
  assert.deepEqual(toMeasurementChoices(saved), {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    version: CONSENT_VERSION,
  });
  assert.deepEqual(toCapturePolicy(saved), {
    captureAttribution: true,
    trackingAuthorized: false,
  });
});

test('falha de leitura do armazenamento retorna para estado desconhecido', () => {
  const brokenStorage = { getItem() { throw new Error('storage unavailable'); } };
  assert.deepEqual(readConsent(brokenStorage), DEFAULT_CONSENT);
});

test('configuração de captura exige ID válido e endpoint HTTPS', () => {
  assert.equal(isValidFormId('delivery-inline-example'), true);
  assert.equal(isValidFormId(''), false);
  assert.equal(isValidFormId('../other'), false);
  assert.equal(isCaptureConfigReady('', 'delivery-inline-example'), false);
  assert.equal(isCaptureConfigReady('http://localhost:3000/hook', 'delivery-inline-example'), false);
  assert.equal(isCaptureConfigReady('https://example.invalid/hook', ''), false);
  assert.equal(isCaptureConfigReady('https://example.invalid/hook', 'delivery-inline-example'), true);
  assert.equal(isCaptureConfigReady('https://user:pass@example.invalid/hook', 'delivery-inline-example'), false);
});

test('evento de consentimento e conversão só publica estados explícitos, sem PII', () => {
  assert.deepEqual(consentUpdateEvent({ analytics: false, advertising: false }), {
    event: 'fitzz_consent_update',
    consent_version: 'consent-v02',
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'granted',
    personalization_storage: 'denied',
    security_storage: 'granted',
  });
  assert.equal(leadConfirmedEvent('pending', 'landing_inline', { analytics: true, advertising: true, decided: true }), null);
  assert.deepEqual(leadConfirmedEvent('confirmed', 'landing_floating', { analytics: true, advertising: false, decided: true }), {
    event: 'fitzz_lead_confirmed',
    capture_point: 'landing_floating',
    fitzz_capture_point: 'landing_floating',
    analytics_consent: true,
    advertising_consent: false,
  });
  assert.equal(leadConfirmedEvent('confirmed', 'landing_inline', { analytics: false, advertising: false, decided: true }), null);
});
