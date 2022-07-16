import type {TypedResponse} from '@/types';

interface ImageResponseOptions extends ResponseInit {
  type:
    | 'image/jpeg'
    | 'image/png'
    | 'image/gif'
    | 'image/svg+xml'
    | 'image/webp'
    | 'image/bmp'
    | 'image/avif';
}

export function image(
  content: Buffer | ArrayBuffer | ReadableStream,
  {type, ...responseInit}: ImageResponseOptions,
): TypedResponse<Blob | Buffer | ArrayBuffer> {
  const headers = new Headers(responseInit.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', type);
  }

  return new Response(content, {
    ...responseInit,
    headers,
  });
}
