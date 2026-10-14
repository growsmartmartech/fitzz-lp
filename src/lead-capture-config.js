const FORM_ID_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/;

export function isValidFormId(value) {
  return typeof value === 'string' && FORM_ID_PATTERN.test(value);
}

export function isCaptureConfigReady(endpoint, formId) {
  if (!isValidFormId(formId) || typeof endpoint !== 'string') return false;
  try {
    const url = new URL(endpoint);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
}
