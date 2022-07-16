import {parseAcceptableHeaders} from './parseAcceptableHeaders';

export function getAcceptableLanguages(request: Request): string[] {
  return parseAcceptableHeaders(request.headers.get('accept-language') ?? '', {
    type: 'accept-language',
    prefixMatch: true,
  });
}
