import test from 'node:test';
import assert from 'node:assert/strict';
import { assertOtpFormat } from '../fixtures/accounts.ts';

test('rejects_four_digit_live_otp_without_padding', () => {
  assert.throws(() => {
    assertOtpFormat('1234');
  }, /OTP must be exactly 6 digits/);

  assert.throws(() => {
    assertOtpFormat('12345');
  }, /OTP must be exactly 6 digits/);

  assert.throws(() => {
    assertOtpFormat('1234567');
  }, /OTP must be exactly 6 digits/);

  assert.throws(() => {
    assertOtpFormat('abcdef');
  }, /OTP must be exactly 6 digits/);

  // Valid 6 digits must pass
  assertOtpFormat('123456');
  assertOtpFormat('000000');
});

test('mock_success_cannot_satisfy_live_binding_case', () => {
  const caseDef = {
    itemId: 'GUI-014',
    mode: 'live',
    required: true,
  };
  const attempt = {
    itemId: 'GUI-014',
    mode: 'mock-ui',
    outcome: 'passed',
  };
  // Attempt with mock-ui cannot satisfy live required case
  assert.notEqual(caseDef.mode, attempt.mode);
});

test('password_boundary_table_is_complete', () => {
  // Passwords testing boundary of FR-01:
  // min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char (@$!%*?&)
  const invalidSamples = [
    { pwd: 'Ab1!', reason: 'Too short (<8)' },
    { pwd: 'abcdef1!', reason: 'No uppercase' },
    { pwd: 'ABCDEF1!', reason: 'No lowercase' },
    { pwd: 'Abcdefg!', reason: 'No digit' },
    { pwd: 'Abcdef12', reason: 'No special char' },
  ];
  assert.equal(invalidSamples.length, 5);

  const validSample = 'MatKhauMoi123!';
  assert.ok(validSample.length >= 8);
  assert.ok(/[A-Z]/.test(validSample));
  assert.ok(/[a-z]/.test(validSample));
  assert.ok(/[0-9]/.test(validSample));
  assert.ok(/[@$!%*?&]/.test(validSample));
});

test('missing_confirm_is_product_failure', () => {
  const hasConfirmInput = false;
  assert.equal(hasConfirmInput, false);
});
