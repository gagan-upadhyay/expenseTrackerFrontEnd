import { loginWithEmail, logoutUser, forgotPassword, loginWithGoogle } from '../authService';

describe('authService', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('loginWithEmail posts credentials and returns data', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ accessToken: 'tok' }), {
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await loginWithEmail('a@b.com', 'pw');
    expect(res).toEqual({ accessToken: 'tok' });
    const [url, opts] = fetchMock.mock.calls[0];
    expect(opts?.method).toBe('POST');
    expect(opts?.body).toBe(JSON.stringify({ email: 'a@b.com', password: 'pw' }));
  });

  it('logoutUser calls logout endpoint', async () => {
    fetchMock.mockResponseOnce('', { status: 200 });
    await logoutUser();
    expect(fetchMock).toHaveBeenCalled();
  });

  it('forgotPassword sends email', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ foo: 'bar' }), {
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await forgotPassword('test@');
    expect(data).toEqual({ foo: 'bar' });
    const [, opts] = fetchMock.mock.calls[0];
    expect(opts?.body).toBe(JSON.stringify({ email: 'test@' }));
  });

  it('loginWithGoogle uses OAuth endpoint', async () => {
    const cred = { credential: 'abc' } as any;
    fetchMock.mockResponseOnce(JSON.stringify({ tokens: { accessToken: 'x' } }), {
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await loginWithGoogle(cred);
    expect(result.tokens.accessToken).toBe('x');
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain('/login/OAuth');
    expect(opts?.headers).toHaveProperty('Authorization');
  });
});
