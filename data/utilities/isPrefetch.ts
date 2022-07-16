/**
 * Adapted from: https://github.com/sergiodxa/remix-utils/blob/6efd89df631eac9df8fdef87ee09c5bc3b13e4c5/src/server/is-prefetch.ts
 */

export function isPrefetch(request: Request): boolean {
  const purpose =
    request.headers.get('Purpose') ||
    request.headers.get('X-Purpose') ||
    request.headers.get('Sec-Purpose') ||
    request.headers.get('Sec-Fetch-Purpose') ||
    request.headers.get('Moz-Purpose') ||
    request.headers.get('X-Moz');

  return purpose?.toLowerCase() === 'prefetch';
}
