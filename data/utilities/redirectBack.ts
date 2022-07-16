import {redirect} from './redirect';

interface RedirectBackOptions extends ResponseInit {
  fallback?: string;
}

export function redirectBack(
  request: Request,
  {fallback = '/', ...init}: RedirectBackOptions = {},
): Response {
  return redirect(request.headers.get('Referer') ?? fallback, init);
}
