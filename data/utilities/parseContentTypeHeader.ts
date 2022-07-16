/**
 * Adapted from: https://github.com/hapijs/content/blob/85ffdbd44c302074b8bbaa93f4700059f9e26500/lib/index.js
 */
const contentTypeRegex = /^([^\/\s]+\/[^\s;]+)(.*)?$/;
const charsetParamRegex = /;\s*charset=(?:"([^"]+)"|([^;"\s]+))/i;
const boundaryParamRegex = /;\s*boundary=(?:"([^"]+)"|([^;"\s]+))/i;

export interface ContentType {
  mime: string;
  charset?: string;
  boundary?: string;
}

export function parseContentTypeHeader(header: string): ContentType {
  if (!header) {
    throw new Error('Invalid content-type header');
  }

  const match = header.match(contentTypeRegex);
  if (!match) {
    throw new Error('Invalid content-type header');
  }

  const result: ContentType = {
    mime: match[1].toLowerCase(),
  };

  const params = match[2];
  if (params) {
    const param = params.match(charsetParamRegex);
    if (param) {
      result.charset = (param[1] || param[2]).toLowerCase();
    }
  }

  if (result.mime.indexOf('multipart/') === 0) {
    if (params) {
      const param = params.match(boundaryParamRegex);
      if (param) {
        result.boundary = param[1] || param[2];
      }
    }

    if (!result.boundary) {
      throw new Error(
        'Invalid content-type header: multipart missing boundary',
      );
    }
  }

  return result;
}
