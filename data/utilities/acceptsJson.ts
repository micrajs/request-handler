import {accepts} from './accepts';

export function acceptsJson(request: Request): boolean {
  return accepts(request, 'application/json');
}
