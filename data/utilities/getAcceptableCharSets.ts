import {parseAcceptableHeaders} from './parseAcceptableHeaders';

export function getAcceptableCharSets(request: Request): string[] {
  return parseAcceptableHeaders(request.headers.get('accept-charset') ?? '', {
    type: 'accept-charset',
  });
}
