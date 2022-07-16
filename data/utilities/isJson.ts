import {getContentTypeHeader} from './getContentTypeHeader';

export function isJson(requestOrResponse: Request | Response): boolean {
  const contentType = getContentTypeHeader(requestOrResponse);

  return (
    contentType.mime.includes('/json') || contentType.mime.includes('+json')
  );
}
