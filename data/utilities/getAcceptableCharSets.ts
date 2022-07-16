import {parseAcceptableHeaders} from './parseAcceptableHeaders';

export function getAcceptableCharSets(
  requestOrResponse: Request | Response,
): string[] {
  return parseAcceptableHeaders(
    requestOrResponse.headers.get('accept-charset') ?? '',
    {
      type: 'accept-charset',
    },
  );
}
