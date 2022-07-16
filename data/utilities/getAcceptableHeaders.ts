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

export function getAcceptableHeaders(
  requestOrResponse: Request | Response,
): AcceptableHeaders {
  return {
    charsets: getAcceptableCharSets(requestOrResponse),
    encodings: getAcceptableEncodings(requestOrResponse),
    languages: getAcceptableLanguages(requestOrResponse),
    mediaTypes: getAcceptableMediaHeaders(requestOrResponse),
  };
}
