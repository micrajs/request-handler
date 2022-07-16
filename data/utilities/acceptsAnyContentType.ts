import {getAcceptableMediaHeaders} from './getAcceptableMediaHeaders';

export function acceptsAnyContentType(request: Request): boolean {
  const accept = getAcceptableMediaHeaders(request);

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
