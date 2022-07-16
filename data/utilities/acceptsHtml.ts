import {accepts} from './accepts';

export function acceptsHtml(request: Request): boolean {
  return accepts(request, 'text/html');
}
