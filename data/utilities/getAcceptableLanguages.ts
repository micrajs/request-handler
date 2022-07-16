import {parseAcceptableHeaders} from './parseAcceptableHeaders';

export function getAcceptableLanguages(
  requestOrResponse: Request | Response,
): string[] {
  return parseAcceptableHeaders(
    requestOrResponse.headers.get('accept-language') ?? '',
    {
      type: 'accept-language',
      prefixMatch: true,
    },
  );
}
