import {parseAcceptableMediaHeaders} from './parseAcceptableMediaHeaders';

export function getAcceptableMediaHeaders(
  requestOrResponse: Request | Response,
): string[] {
  return parseAcceptableMediaHeaders(
    requestOrResponse.headers.get('accept') ?? '',
  );
}
