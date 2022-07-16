import type {TypedResponse} from '@/types';

export function pdf(
  content: Blob | Buffer | ArrayBuffer,
  statusOrInit: number | ResponseInit = {},
): TypedResponse<Blob | Buffer | ArrayBuffer> {
  const responseInit =
    typeof statusOrInit === 'number' ? {status: statusOrInit} : statusOrInit;
  const headers = new Headers(responseInit.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/pdf');
  }

  return new Response(content, {
    ...responseInit,
    headers,
  });
}
