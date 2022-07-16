import {accepts} from './accepts';

export function acceptsJson(requestOrResponse: Request | Response): boolean {
  return accepts(requestOrResponse, 'application/json');
}
