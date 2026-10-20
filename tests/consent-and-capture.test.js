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

test('sem uma escolha válida, toda medição permanece negada', () => {
  assert.deepEqual(normalizeConsent(null), DEFAULT_CONSENT);
  assert.deepEqual(normalizeConsent({ version: 'old', analytics: true, advertising: true }), DEFAULT_CONSENT);
  assert.deepEqual(toMeasurementChoices(DEFAULT_CONSENT), {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    version: CONSENT_VERSION,
  });
});

test('salva e recupera escolhas separadas de analytics e publicidade', () => {
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
});

test('falha de leitura do armazenamento retorna para consentimento negado', () => {
  const brokenStorage = { getItem() { throw new Error('storage unavailable'); } };
  assert.deepEqual(readConsent(brokenStorage), DEFAULT_CONSENT);
});

test('configuração de captura exige ID sintaticamente válido e endpoint HTTPS', () => {
  assert.equal(isValidFormId('delivery-inline-example'), true);
  assert.equal(isValidFormId(''), false);
  assert.equal(isValidFormId('../other'), false);
  assert.equal(isCaptureConfigReady('', 'delivery-inline-example'), false);
  assert.equal(isCaptureConfigReady('http://localhost:3000/hook', 'delivery-inline-example'), false);
  assert.equal(isCaptureConfigReady('https://example.invalid/hook', ''), false);
  assert.equal(isCaptureConfigReady('https://example.invalid/hook', 'delivery-inline-example'), true);
  assert.equal(isCaptureConfigReady('https://user:pass@example.invalid/hook', 'delivery-inline-example'), false);
});

test('eventos seguem o contrato GTM da landing de kits e não carregam PII', () => {
  assert.deepEqual(consentUpdateEvent({ analytics: false, advertising: false }), {
    event: 'fitzz_consent_update',
    consent_version: 'consent-v01',
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'granted',
    personalization_storage: 'denied',
    security_storage: 'granted',
  });
  assert.deepEqual(leadConfirmedEvent('pending', 'landing_inline'), null);
  assert.deepEqual(leadConfirmedEvent('confirmed', 'landing_floating', { analytics: true, advertising: true }), {
    event: 'fitzz_lead_confirmed',
    capture_point: 'landing_floating',
    analytics_consent: true,
    advertising_consent: true,
  });
  assert.equal(leadConfirmedEvent('confirmed', 'landing_inline').advertising_consent, false);
  assert.equal(leadConfirmedEvent('confirmed', 'landing_inline', { analytics: true, advertising: false }).advertising_consent, false);
});
