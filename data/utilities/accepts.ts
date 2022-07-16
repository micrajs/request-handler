import {getAcceptableMediaHeaders} from './getAcceptableMediaHeaders';

export function accepts(
  requestOrResponse: Request | Response,
  ...contentTypes: string[]
): boolean {
  const accept = getAcceptableMediaHeaders(requestOrResponse);

  if (accept.length === 0) {
    return true;
  }

  for (const accepts of accept) {
    if (accepts === '*/*' || accepts === '*') {
      return true;
    }

    for (const types of contentTypes) {
      if (accepts === types || accepts === `${types.split('/')[0]}/*`) {
        return true;
      }
    }
  }

  return false;
}
