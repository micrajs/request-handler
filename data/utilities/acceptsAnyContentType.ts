import {getAcceptableMediaHeaders} from './getAcceptableMediaHeaders';

export function acceptsAnyContentType(
  requestOrResponse: Request | Response,
): boolean {
  const accept = getAcceptableMediaHeaders(requestOrResponse);

  if (accept.length === 0) {
    return true;
  }

  for (const accepts of accept) {
    if (accepts === '*/*' || accepts === '*') {
      return true;
    }
  }

  return false;
}
