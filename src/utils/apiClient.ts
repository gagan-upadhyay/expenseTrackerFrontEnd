import { refreshToken as fetchRefreshToken } from './data';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

let isRefreshing = false;
let refreshPromise: Promise<{ accessToken: string | null }> | null = null;

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;

  const buildInit = (): RequestInit => ({
    credentials: 'include',      // ✅ Always send cookies
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  let res = await fetch(url, buildInit());

  // ✅ On 401: always attempt silent refresh — never gate on httpOnly cookie check
  if (res.status === 401) {
    try {
      // ✅ Deduplicate: if multiple requests fail simultaneously, only refresh once
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = fetchRefreshToken() as Promise<{ accessToken: string | null }>;
      }

      const data = await refreshPromise;
      isRefreshing = false;
      refreshPromise = null;

      if (data?.accessToken) {
        // ✅ Retry the original request — browser will send the new cookie automatically
        res = await fetch(url, buildInit());
      } else {
        // Refresh returned no token — session is truly dead
        throw new Error('Session expired. Please log in again.');
      }
    } catch (err) {
      isRefreshing = false;
      refreshPromise = null;
      console.warn('Silent refresh failed:', err);
      // Let the error propagate so UI can handle logout
      throw new Error('Session expired. Please log in again.');
    }
  }

  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage = res.statusText;
    try {
      const parsed = JSON.parse(errorText);
      errorMessage = parsed.error || errorMessage;
    } catch {
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  return (await res.text()) as unknown as T;
}

export default apiFetch;