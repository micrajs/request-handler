import {getContentTypeHeader} from './getContentTypeHeader';

export function isJson(request: Request): boolean {
  const contentType = getContentTypeHeader(request);

  return (
    contentType.mime.includes('/json') || contentType.mime.includes('+json')
  );
}
