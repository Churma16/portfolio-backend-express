import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { generateToken, verifyToken } from './jwt';

describe('JWT Utility', () => {
  const originalSecretKey = process.env.TOKEN_SYMMETRIC_KEY;

  before(() => {
    process.env.TOKEN_SYMMETRIC_KEY = 'test_secret_key_with_sufficient_length_32_bytes!';
  });

  after(() => {
    if (originalSecretKey !== undefined) {
      process.env.TOKEN_SYMMETRIC_KEY = originalSecretKey;
    } else {
      delete process.env.TOKEN_SYMMETRIC_KEY;
    }
  });

  it('generates a valid signed JWT and verifies payload successfully', () => {
    const userId = 42;
    const userEmail = 'admin@churma.codes';

    const generatedToken = generateToken(userId, userEmail);
    assert.ok(typeof generatedToken === 'string');
    assert.ok(generatedToken.length > 20);

    const decodedPayload = verifyToken(generatedToken);
    assert.equal(decodedPayload.user_id, userId);
    assert.equal(decodedPayload.email, userEmail);
  });

  it('rejects tampered or malformed tokens during verification', () => {
    const validToken = generateToken(1, 'valid@churma.codes');
    const tamperedToken = validToken.slice(0, -5) + 'abcde';

    assert.throws(() => {
      verifyToken(tamperedToken);
    });
  });

  it('throws an explicit error when TOKEN_SYMMETRIC_KEY is not defined', () => {
    delete process.env.TOKEN_SYMMETRIC_KEY;

    assert.throws(() => {
      generateToken(1, 'no_key@churma.codes');
    }, /TOKEN_SYMMETRIC_KEY environment variable is required/);

    process.env.TOKEN_SYMMETRIC_KEY = 'test_secret_key_with_sufficient_length_32_bytes!';
  });
});
