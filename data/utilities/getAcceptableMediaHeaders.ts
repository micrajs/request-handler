import {parseAcceptableMediaHeaders} from './parseAcceptableMediaHeaders';

export function getAcceptableMediaHeaders(request: Request): string[] {
  return parseAcceptableMediaHeaders(request.headers.get('accept') ?? '');
}
