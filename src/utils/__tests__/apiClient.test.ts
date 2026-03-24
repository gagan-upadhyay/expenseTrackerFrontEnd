import apiFetch from '../apiClient';
import { getCookie } from '../getCookie';
import { refreshToken } from '../data';

jest.mock('../getCookie');
jest.mock('../data');

describe('apiClient', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('returns parsed JSON when fetch succeeds', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ hello: 'world' }), {
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await apiFetch('/some/path');
    expect(res).toEqual({ hello: 'world' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe('/some/path');
    expect(opts?.credentials).toBe('include');
  });

  it('tries refresh token on 401 and retries request', async () => {
    (getCookie as jest.Mock).mockReturnValue('refresh-token');
    (refreshToken as jest.Mock).mockResolvedValue({ accessToken: 'newtok' });

    // first call returns 401
    fetchMock.mockResponses(
      ['', { status: 401 }],
      [JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } }]
    );

    const res = await apiFetch('/protected');
    expect(res).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('throws error when non-ok response', async () => {
    fetchMock.mockResponseOnce('err', { status: 500, statusText: 'Uh oh' });
    await expect(apiFetch('/fail')).rejects.toThrow('err');
  });
});
