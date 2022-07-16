import {
  parseContentDispositionHeader,
  type ContentDisposition,
} from './parseContentDispositionHeader';

export function getContentDispositionHeader(
  requestOrResponse: Request | Response,
): ContentDisposition {
  return parseContentDispositionHeader(
    requestOrResponse.headers.get('content-disposition') ?? '',
  );
}
