import {parseAcceptableHeaders} from './parseAcceptableHeaders';

export function getAcceptableEncodings(
  requestOrResponse: Request | Response,
): string[] {
  return parseAcceptableHeaders(
    requestOrResponse.headers.get('accept-encoding') ?? '',
    {
      type: 'accept-encoding',
      default: 'identity',
      equivalents: new Map([
        ['x-compress', 'compress'],
        ['x-gzip', 'gzip'],
      ]),
    },
  );
}
