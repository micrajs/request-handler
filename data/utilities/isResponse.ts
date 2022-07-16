/**
 * Adapted from: https://github.com/remix-run/remix/blob/f752f8256ed5fba35b7878f7e14ef137968a115c/packages/remix-server-runtime/responses.ts
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isResponse(value: any): value is Response {
  return (
    value != null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    typeof value.status === 'number' &&
    typeof value.statusText === 'string' &&
    typeof value.headers === 'object' &&
    typeof value.body !== 'undefined'
  );
}
