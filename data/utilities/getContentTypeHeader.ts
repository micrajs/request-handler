import {
  parseContentTypeHeader,
  type ContentType,
} from './parseContentTypeHeader';

export function getContentTypeHeader(
  requestOrResponse: Request | Response,
): ContentType {
  return parseContentTypeHeader(
    requestOrResponse.headers.get('content-type') ?? '',
  );
}
