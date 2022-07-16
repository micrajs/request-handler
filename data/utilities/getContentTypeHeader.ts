import {
  parseContentTypeHeader,
  type ContentType,
} from './parseContentTypeHeader';

export function getContentTypeHeader(request: Request): ContentType {
  return parseContentTypeHeader(request.headers.get('content-type') ?? '');
}
