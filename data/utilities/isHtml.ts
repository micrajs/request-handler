import {getContentTypeHeader} from './getContentTypeHeader';

export function isHtml(requestOrResponse: Request | Response): boolean {
  const contentType = getContentTypeHeader(requestOrResponse);

  return contentType.mime.includes('text/html');
}
