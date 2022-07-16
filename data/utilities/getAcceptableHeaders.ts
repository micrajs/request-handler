import {getAcceptableCharSets} from './getAcceptableCharSets';
import {getAcceptableEncodings} from './getAcceptableEncodings';
import {getAcceptableLanguages} from './getAcceptableLanguages';
import {getAcceptableMediaHeaders} from './getAcceptableMediaHeaders';

interface AcceptableHeaders {
  charsets: string[];
  encodings: string[];
  languages: string[];
  mediaTypes: string[];
}

export function getAcceptableHeaders(request: Request): AcceptableHeaders {
  return {
    charsets: getAcceptableCharSets(request),
    encodings: getAcceptableEncodings(request),
    languages: getAcceptableLanguages(request),
    mediaTypes: getAcceptableMediaHeaders(request),
  };
}
