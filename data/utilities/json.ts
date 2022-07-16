/**
 * Adapted from: https://github.com/remix-run/remix/blob/f752f8256ed5fba35b7878f7e14ef137968a115c/packages/remix-server-runtime/responses.ts
 */
import type {TypedResponse} from '@/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function json<T = any>(
  data: T,
  statusOrInit: number | ResponseInit = {},
): TypedResponse<T> {
  const responseInit =
    typeof statusOrInit === 'number' ? {status: statusOrInit} : statusOrInit;
  const headers = new Headers(responseInit.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  return new Response(JSON.stringify(data), {
    ...responseInit,
    headers,
  });
}
