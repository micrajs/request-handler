/**
 * Adapted from: https://github.com/hapijs/accept/blob/b762ab2b34d679b455f142a1d2e753faebe086d3/lib/index.js
 */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
interface Selection {
  token: string;
  pos: number;
  q: number;
  pref?: number;
}

interface AcceptableHeadersOptions {
  type: string;
  prefixMatch?: boolean;
  default?: string;
  equivalents?: Map<string, string>;
}

export function parseAcceptableHeaders(
  raw: string,
  options: AcceptableHeadersOptions,
) {
  // Normalize header (remove spaces and tabs)
  const header = raw.replace(/[ \t]/g, '');

  // Parse selections
  const parts = header.split(',');
  const selections: Selection[] = [];
  const map = new Set();

  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    if (!part) {
      // Ignore empty parts or leading commas
      continue;
    }

    // Parse parameters
    const params = part.split(';');
    if (params.length > 2) {
      throw new Error(`Invalid ${options.type} header`);
    }

    let token = params[0].toLowerCase();
    if (!token) {
      throw new Error(`Invalid ${options.type} header`);
    }

    if (options.equivalents?.has(token)) {
      token = options.equivalents.get(token)!;
    }

    const selection: Selection = {
      token,
      pos: i,
      q: 1,
    };

    map.add(selection.token);

    // Parse q=value

    if (params.length === 2) {
      const q = params[1];
      const [key, value] = q.split('=');

      if (!value || (key !== 'q' && key !== 'Q')) {
        throw new Error(`Invalid ${options.type} header`);
      }

      const score = parseFloat(value);
      if (score === 0) {
        continue;
      }

      if (Number.isFinite(score) && score <= 1 && score >= 0.001) {
        selection.q = score;
      }
    }

    selections.push(selection); // Only add allowed selections (q !== 0)
  }

  // Sort selection based on q and then position in header
  selections.sort(sortSelections);

  // Extract tokens
  const values = selections.map((selection) => selection.token);

  if (options.default && !map.has(options.default)) {
    values.push(options.default);
  }

  return values;
}

function sortSelections(a: Selection, b: Selection) {
  const aFirst = -1;
  const bFirst = 1;

  if (b.q !== a.q) {
    return b.q - a.q;
  }

  if (b.pref !== a.pref) {
    if (a.pref === undefined) {
      return bFirst;
    }

    if (b.pref === undefined) {
      return aFirst;
    }

    return a.pref - b.pref;
  }

  return a.pos - b.pos;
}
