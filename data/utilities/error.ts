import type {TypedResponse} from '@/types';
import {HTTPError, isMicraError, WrappedError} from '@micra/error';

export function error(
  messageOrError: string | Error,
  statusOrInit: number | ResponseInit = {},
): TypedResponse<Micra.ErrorMessage> {
  const responseInit =
    typeof statusOrInit === 'number' ? {status: statusOrInit} : statusOrInit;
  const headers = new Headers(responseInit.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  const err = isMicraError(messageOrError)
    ? messageOrError
    : messageOrError instanceof Error
    ? new WrappedError(messageOrError, {
        status: responseInit.status,
        title: responseInit.statusText,
      })
    : new HTTPError(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (responseInit.status as any) ?? 500,
        String(messageOrError),
      );

  return new Response(JSON.stringify(err.serialize()), {
    status: err.statusCode,
    ...responseInit,
    headers,
  });
}
