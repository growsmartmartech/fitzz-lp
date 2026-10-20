export const CONSENT_VERSION = 'consent-v01';
export const CONSENT_STORAGE_KEY = 'fitzz-consent-preferences';

export const DEFAULT_CONSENT = Object.freeze({
  analytics: false,
  advertising: false,
  decided: false,
});

export function normalizeConsent(value) {
  if (!value || typeof value !== 'object' || value.version !== CONSENT_VERSION) {
    return { ...DEFAULT_CONSENT };
  }

  return {
    analytics: value.analytics === true,
    advertising: value.advertising === true,
    decided: true,
  };
}

export function readConsent(storage) {
  try {
    const store = storage || globalThis.localStorage;
    const stored = store?.getItem(CONSENT_STORAGE_KEY);
    return stored ? normalizeConsent(JSON.parse(stored)) : { ...DEFAULT_CONSENT };
  } catch {
    return { ...DEFAULT_CONSENT };
  }
}

export function saveConsent(storage, choices) {
  const consent = {
    analytics: choices?.analytics === true,
    advertising: choices?.advertising === true,
    decided: true,
  };
  storage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({
    version: CONSENT_VERSION,
    analytics: consent.analytics,
    advertising: consent.advertising,
    savedAt: new Date().toISOString(),
  }));
  return consent;
}

export function toMeasurementChoices(consent) {
  const analytics = consent?.analytics === true ? 'granted' : 'denied';
  const advertising = consent?.advertising === true ? 'granted' : 'denied';
  return {
    analytics_storage: analytics,
    ad_storage: advertising,
    ad_user_data: advertising,
    ad_personalization: advertising,
    version: CONSENT_VERSION,
  };
}

export function consentUpdateEvent(consent) {
  return {
    event: 'fitzz_consent_update',
    consent_version: CONSENT_VERSION,
    analytics_storage: consent?.analytics === true ? 'granted' : 'denied',
    ad_storage: consent?.advertising === true ? 'granted' : 'denied',
    ad_user_data: consent?.advertising === true ? 'granted' : 'denied',
    ad_personalization: consent?.advertising === true ? 'granted' : 'denied',
    functionality_storage: 'granted',
    personalization_storage: 'denied',
    security_storage: 'granted',
  };
}

export function leadConfirmedEvent(status, capturePoint, consent) {
  if (status !== 'confirmed' || typeof capturePoint !== 'string' || !capturePoint) return null;
  return {
    event: 'fitzz_lead_confirmed',
    capture_point: capturePoint,
    analytics_consent: consent?.analytics === true,
    advertising_consent: consent?.advertising === true,
  };
}
