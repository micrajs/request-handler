export function javascript(
  content: string,
  statusOrInit: number | ResponseInit = {},
): Response {
  const responseInit =
    typeof statusOrInit === 'number' ? {status: statusOrInit} : statusOrInit;
  const headers = new Headers(responseInit.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/javascript; charset=utf-8');
  }

  return new Response(content, {
    ...responseInit,
    headers,
  });
}
