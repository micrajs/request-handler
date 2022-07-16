import {accepts} from './accepts';

export function acceptsHtml(requestOrResponse: Request | Response): boolean {
  return accepts(requestOrResponse, 'text/html');
}
