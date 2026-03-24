import { getCookie } from './getCookie';
import { refreshToken as fetchRefreshToken } from './data';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

console.log(`Value fof BASE_URL:${BASE_URL} from apiclient`);

// Generic fetch wrapper that automatically includes credentials and handles
// token refreshing when a 401 Unauthorized is returned.
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const init: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  };

  let res= await fetch(url, init);
//   console.log('Value of res from apiclient:', res);

  // if unauthorized try silent refresh
  if (res.status === 401) {
    const refreshCookie = getCookie('refreshToken');
    if (refreshCookie) {
      try {
        const data:{accessToken:string|null} = await fetchRefreshToken(refreshCookie) as {accessToken:string|null};
        // console.log("Value of data from apiCLient.ts", data)
        if (data && data?.accessToken) {
          // update cookie and retry original request
          document.cookie = `accessToken=${data?.accessToken}; path=/;`;
          res = await fetch(url, init);
        }
      } catch (err) {
        // ignore refresh errors; original response will be returned below
        console.warn('refresh token failed', err);
      }
    }
  }
  
  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage = res.statusText;
    try{
      const parsed = JSON.parse(errorText);
      errorMessage = parsed.error || errorMessage;
    }catch{
      errorMessage = errorText||errorMessage;
    }
    throw new Error(errorMessage);

  }

  // attempt parse json; if no body return empty
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  return (await res.text()) as unknown as T;
}

export default apiFetch;
