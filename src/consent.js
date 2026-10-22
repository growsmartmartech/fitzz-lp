export const CONSENT_VERSION = 'consent-v02';
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
  const decided = consent?.decided === true;
  const analytics = decided ? (consent.analytics === true ? 'granted' : 'denied') : 'unknown';
  const advertising = decided ? (consent.advertising === true ? 'granted' : 'denied') : 'unknown';
  return {
    analytics_storage: analytics,
    ad_storage: advertising,
    ad_user_data: advertising,
    ad_personalization: advertising,
    version: decided ? CONSENT_VERSION : null,
  };
}

export function toCapturePolicy(consent) {
  const decided = consent?.decided === true;
  const analytics = decided && consent.analytics === true;
  const advertising = decided && consent.advertising === true;
  return {
    captureAttribution: decided && (analytics || advertising),
    trackingAuthorized: advertising,
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
  const resolved = consent?.decided === true;
  const analytics = resolved && consent.analytics === true;
  const advertising = resolved && consent.advertising === true;
  if (status !== 'confirmed' || !(analytics || advertising)) return null;
  const point = typeof capturePoint === 'string' && capturePoint ? capturePoint : 'unknown';
  return {
    event: 'fitzz_lead_confirmed',
    capture_point: point,
    fitzz_capture_point: point,
    analytics_consent: analytics,
    advertising_consent: advertising,
  };
}
