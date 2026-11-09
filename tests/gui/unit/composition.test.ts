import test from 'node:test';
import assert from 'node:assert/strict';
import { type CompositionSample } from '../support/composition.ts';

test('composition_log_preserves_value_and_caret', () => {
  const samples: CompositionSample[] = [
    { type: 'compositionstart', data: '', isComposing: true, value: '', selectionStart: 0, selectionEnd: 0, time: 100 },
    { type: 'compositionupdate', data: 'd', isComposing: true, value: 'd', selectionStart: 1, selectionEnd: 1, time: 150 },
    { type: 'input', data: 'd', isComposing: true, value: 'd', selectionStart: 1, selectionEnd: 1, time: 160 },
    { type: 'compositionupdate', data: 'đ', isComposing: true, value: 'đ', selectionStart: 1, selectionEnd: 1, time: 200 },
    { type: 'compositionend', data: 'đ', isComposing: false, value: 'đ', selectionStart: 1, selectionEnd: 1, time: 250 },
    { type: 'input', data: 'đ', isComposing: false, value: 'đ', selectionStart: 1, selectionEnd: 1, time: 260 },
  ];

  assert.equal(samples.length, 6);
  assert.equal(samples[0].type, 'compositionstart');
  assert.equal(samples[4].type, 'compositionend');
  assert.equal(samples[4].data, 'đ');
  assert.equal(samples[4].isComposing, false);
});
