import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const source = fs.readFileSync(new URL('../src/fitzz-lead-capture.js', import.meta.url), 'utf8');

test('abre o WhatsApp em nova aba antes de aguardar o POST', () => {
  const start = source.indexOf('async _submit() {');
  const end = source.indexOf('\\n    _retrySeconds(', start);
  const submit = source.slice(start, end);
  const open = submit.indexOf('this._openWhatsAppImmediately()');
  const post = submit.indexOf('await this._fetch(endpoint.href');
  assert.ok(open >= 0 && post > open);
  assert.ok(source.includes("window.open('about:blank', '_blank')"));
  assert.ok(source.includes('popup.location.replace(wa)'));
});

test('mantém um link alternativo se o navegador bloquear a nova aba', () => {
  assert.ok(source.includes("link.href = wa; link.target = '_blank'"));
  assert.ok(source.includes('this._whatsappAttemptStarted = true'));
  assert.ok(!source.includes('window.location.assign(wa)'));
});

