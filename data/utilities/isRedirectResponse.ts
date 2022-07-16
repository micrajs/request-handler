/**
 * Adapted from: https://github.com/remix-run/remix/blob/f752f8256ed5fba35b7878f7e14ef137968a115c/packages/remix-server-runtime/responses.ts
 */
import {isResponse} from './isResponse';

const redirectStatusCodes = [301, 302, 303, 307, 308];

export function isRedirectResponse(response: Response): boolean {
  return isResponse(response) && redirectStatusCodes.includes(response.status);
}
