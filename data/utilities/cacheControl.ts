export interface CacheControlOptions {
  maxAge: number;
  sMaxAge: number;
  public: boolean;
  private: boolean;
  noCache: boolean;
  noStore: boolean;
  noTransform: boolean;
  mustRevalidate: boolean;
  proxyRevalidate: boolean;
  immutable: boolean;
  mustUnderstand: boolean;
  staleWhileRevalidate: number;
  staleIfError: number;
}

function encodeCacheControl(options: Partial<CacheControlOptions>): string {
  const {
    maxAge,
    sMaxAge,
    public: isPublic,
    private: isPrivate,
    noCache,
    noStore,
    noTransform,
    mustRevalidate,
    proxyRevalidate,
    immutable,
    mustUnderstand,
    staleWhileRevalidate,
    staleIfError,
  } = options;

  const directives: string[] = [];

  if (maxAge) {
    directives.push(`max-age=${maxAge}`);
  }

  if (sMaxAge) {
    directives.push(`s-maxage=${sMaxAge}`);
  }

  if (isPublic) {
    directives.push('public');
  }

  if (isPrivate) {
    directives.push('private');
  }

  if (noCache) {
    directives.push('no-cache');
  }

  if (noStore) {
    directives.push('no-store');
  }

  if (noTransform) {
    directives.push('no-transform');
  }

  if (mustRevalidate) {
    directives.push('must-revalidate');
  }

  if (proxyRevalidate) {
    directives.push('proxy-revalidate');
  }

  if (immutable) {
    directives.push('immutable');
  }

  if (mustUnderstand) {
    directives.push('must-understand');
  }

  if (staleWhileRevalidate) {
    directives.push(`stale-while-revalidate=${staleWhileRevalidate}`);
  }

  if (staleIfError) {
    directives.push(`stale-if-error=${staleIfError}`);
  }

  return directives.join(', ');
}

export function cacheControl(
  options: Partial<CacheControlOptions>,
): Micra.Middleware {
  return async function CacheControlMiddleware({}, next) {
    const response = await next();
    if (response && response.status === 200) {
      response.headers.set('Cache-Control', encodeCacheControl(options));
    }
    return response;
  };
}
