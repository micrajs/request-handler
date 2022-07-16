/**
 * Adapted from: https://github.com/remix-run/remix/blob/f752f8256ed5fba35b7878f7e14ef137968a115c/packages/remix-server-runtime/responses.ts
 */
import type {TypedResponse} from '@/types';

export function redirect(
  url: string,
  statusOrInit: number | ResponseInit = 302,
): TypedResponse<null> {
  let responseInit = statusOrInit;
  if (typeof responseInit === 'number') {
    responseInit = {status: responseInit};
  } else if (typeof responseInit.status === 'undefined') {
    responseInit.status = 302;
  }

  const headers = new Headers(responseInit.headers);
  headers.set('Location', url);

  return new Response(JSON.stringify(null), {
    ...responseInit,
    headers,
  });
}
