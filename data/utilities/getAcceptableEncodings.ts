import {parseAcceptableHeaders} from './parseAcceptableHeaders';

export function getAcceptableEncodings(request: Request): string[] {
  return parseAcceptableHeaders(request.headers.get('accept-encoding') ?? '', {
    type: 'accept-encoding',
    default: 'identity',
    equivalents: new Map([
      ['x-compress', 'compress'],
      ['x-gzip', 'gzip'],
    ]),
  });
}
