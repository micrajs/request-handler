import {getAcceptableMediaHeaders} from './getAcceptableMediaHeaders';

export function wantsJson(requestOrResponse: Request | Response): boolean {
  const accepts = getAcceptableMediaHeaders(requestOrResponse);

  return accepts.some(
    (type) => type.includes('/json') || type.includes('+json'),
  );
}
