import {getAcceptableMediaHeaders} from './getAcceptableMediaHeaders';

export function wantsJson(request: Request): boolean {
  const accepts = getAcceptableMediaHeaders(request);

  return accepts.some(
    (type) => type.includes('/json') || type.includes('+json'),
  );
}
