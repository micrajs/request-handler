/**
 * Adapted from: https://github.com/hapijs/accept/blob/b762ab2b34d679b455f142a1d2e753faebe086d3/lib/index.js
 */
const validMediaRx =
  /^(?:\*\/\*)|(?:[\w\!#\$%&'\*\+\-\.\^`\|~]+\/\*)|(?:[\w\!#\$%&'\*\+\-\.\^`\|~]+\/[\w\!#\$%&'\*\+\-\.\^`\|~]+)$/;

interface MediaSelection {
  token: string;
  params: Record<string, string>;
  exts: Record<string, string>;
  pos: number;
  q?: number;
  original: string;
  type: string;
  subtype: string;
  specificity: number;
}

export function parseAcceptableMediaHeaders(raw: string) {
  // Normalize header (remove spaces and temporary remove quoted strings)
  const {header, quoted} = normalize(raw);

  // Parse selections
  const parts = header.split(',');
  const selections: MediaSelection[] = [];
  const map: Record<string, MediaSelection> = {};

  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    if (!part) {
      // Ignore empty parts or leading commas
      continue;
    }

    // Parse parameters
    const pairs = part.split(';');
    const token = pairs.shift()?.toLowerCase() ?? '';

    if (!validMediaRx.test(token)) {
      // Ignore invalid types
      continue;
    }

    const selection: MediaSelection = {
      token,
      params: {},
      exts: {},
      pos: i,
      original: '',
      type: '',
      subtype: '',
      specificity: -1,
    };

    // Parse key=value
    let target: 'params' | 'exts' = 'params';
    for (const pair of pairs) {
      const kv = pair.split('=');
      if (kv.length !== 2 || !kv[1]) {
        throw new Error(`Invalid accept header`);
      }

      const key = kv[0];
      let value: number | string = kv[1];

      if (key === 'q' || key === 'Q') {
        target = 'exts';

        value = parseFloat(value);
        if (
          !Number.isFinite(value) ||
          value > 1 ||
          (value < 0.001 && value !== 0)
        ) {
          value = 1;
        }

        selection.q = value;
      } else {
        if (value[0] === '"') {
          value = `"${quoted[value]}"`;
        }

        selection[target][kv[0]] = value;
      }
    }

    const params = Object.keys(selection.params);
    selection.original = ['']
      .concat(params.map((key) => `${key}=${selection.params[key]}`))
      .join(';');
    selection.specificity = params.length;

    if (selection.q === undefined) {
      // Default no preference to q=1 (top preference)
      selection.q = 1;
    }

    const tparts = selection.token.split('/');
    selection.type = tparts[0];
    selection.subtype = tparts[1];

    map[selection.token] = selection;

    if (selection.q) {
      // Skip denied selections (q=0)
      selections.push(selection);
    }
  }

  // Sort selection based on q and then position in header
  selections.sort(sort);

  return selections.map((selection) => selection.token + selection.original);
}

function normalize(raw: string) {
  raw = raw || '*/*';

  const normalized: {
    header: string;
    quoted: Record<string, string>;
  } = {
    header: raw,
    quoted: {},
  };

  if (raw.includes('"')) {
    let i = 0;
    normalized.header = raw.replace(/="([^"]*)"/g, ($0, $1) => {
      const key = '"' + ++i;
      normalized.quoted[key] = $1;
      return '=' + key;
    });
  }

  normalized.header = normalized.header.replace(/[ \t]/g, '');
  return normalized;
}

function sort(a: MediaSelection, b: MediaSelection) {
  // Sort by quality score
  if (b.q && a.q && b.q !== a.q) {
    return b.q - a.q;
  }

  // Sort by type
  if (a.type !== b.type) {
    return innerSort(a, b, 'type');
  }

  // Sort by subtype
  if (a.subtype !== b.subtype) {
    return innerSort(a, b, 'subtype');
  }

  // Sort by specificity
  if (a.specificity !== b.specificity) {
    return b.specificity - a.specificity;
  }

  return a.pos - b.pos;
}

function innerSort(
  a: MediaSelection,
  b: MediaSelection,
  key: 'type' | 'subtype',
) {
  const aFirst = -1;
  const bFirst = 1;

  if (a[key] === '*') {
    return bFirst;
  }

  if (b[key] === '*') {
    return aFirst;
  }

  // Group alphabetically
  return a[key] < b[key] ? aFirst : bFirst;
}
