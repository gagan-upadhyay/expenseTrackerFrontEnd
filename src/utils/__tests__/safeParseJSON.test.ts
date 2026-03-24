import { z } from 'zod';
import { safeParseJson, safeParseJsonResult, ensureOkThenParse } from '../safeParseJSON';

// avoid real logger during tests
jest.mock('../../services/logger-service', () => {
  return jest.fn(() => ({
    debug: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
  }));
});

describe('safeParseJSON utilities', () => {
  const schema = z.object({ foo: z.string() });

  test('safeParseJson returns data when response matches schema', async () => {
    const res = new Response(JSON.stringify({ foo: 'bar' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    const parsed = await safeParseJson(res, schema);
    expect(parsed).toEqual({ foo: 'bar' });
  });

  test('safeParseJson returns null when response is invalid JSON', async () => {
    const res = new Response('notjson', {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    const parsed = await safeParseJson(res, schema);
    expect(parsed).toBeNull();
  });

  test('safeParseJsonResult handles validation failure', async () => {
    const res = new Response(JSON.stringify({ baz: 123 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await safeParseJsonResult(res, schema);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('Schema validation failed');
      expect(result.status).toBe(200);
    }
  });

  test('ensureOkThenParse returns error when response not ok', async () => {
    const res = new Response('', { status: 404, statusText: 'Not Found' });
    const result = await ensureOkThenParse(res, async () => ({ ok: true, data: {} }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(404);
      expect(result.error).toMatch(/Request failed with status 404/);
    }
  });
});
