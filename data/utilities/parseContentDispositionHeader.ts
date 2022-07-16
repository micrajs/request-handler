/**
 * Adapted from: https://github.com/hapijs/content/blob/85ffdbd44c302074b8bbaa93f4700059f9e26500/lib/index.js
 */
export interface ContentDisposition {
  name: string;
  filename: string;
}

const contentDispositionRegex = /^\s*form-data\s*(?:;\s*(.+))?$/i;
const contentDispositionParamRegex =
  /([^\=\*\s]+)(\*)?\s*\=\s*(?:([^;'"\s]+\'[\w-]*\'[^;\s]+)|(?:\"([^"]*)\")|([^;\s]*))(?:\s*(?:;\s*)|$)/g;

export function parseContentDispositionHeader(
  header: string,
): ContentDisposition {
  if (!header) {
    throw new Error('Missing content-disposition header');
  }

  const match = header.match(contentDispositionRegex);
  if (!match) {
    throw new Error('Invalid content-disposition header format');
  }

  const parameters = match[1];
  if (!parameters) {
    throw new Error('Invalid content-disposition header missing parameters');
  }

  const result = {} as ContentDisposition;

  parameters.replace(
    contentDispositionParamRegex,
    (_, $1: 'name' | 'filename' | '__proto__', $2, $3, $4, $5) => {
      if ($1 === '__proto__') {
        throw new Error(
          'Invalid content-disposition header format includes invalid parameters',
        );
      }

      let value: string;

      if ($2) {
        if (!$3) {
          throw new Error(
            'Invalid content-disposition header format includes invalid parameters',
          );
        }

        try {
          value = decodeURIComponent($3.split("'")[2]);
        } catch (err) {
          throw new Error(
            'Invalid content-disposition header format includes invalid parameters',
          );
        }
      } else {
        value = $4 || $5 || '';
      }

      if ($1 === 'name' && value === '__proto__') {
        throw new Error(
          'Invalid content-disposition header format includes invalid parameters',
        );
      }

      result[$1] = value;

      return _;
    },
  );

  if (!result.name) {
    throw new Error(
      'Invalid content-disposition header missing name parameter',
    );
  }

  return result;
}
