import {
  parseContentDispositionHeader,
  type ContentDisposition,
} from './parseContentDispositionHeader';

export function getContentDispositionHeader(
  request: Request,
): ContentDisposition {
  return parseContentDispositionHeader(
    request.headers.get('content-disposition') ?? '',
  );
}
