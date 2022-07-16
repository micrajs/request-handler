/**
 * Adapted from: https://github.com/sergiodxa/remix-utils/blob/6efd89df631eac9df8fdef87ee09c5bc3b13e4c5/src/server/cors.ts
 */
type Origin = boolean | string | RegExp | Array<string | RegExp>;

interface CORSOptions {
  /**
   * Configures the **Access-Control-Allow-Origin** CORS header.
   *
   * Possible values:
   * - true: Enable CORS for any origin (same as "*")
   * - false: Don't setup CORS
   * - string: Set to a specific origin, if set to "*" it will allow any origin
   * - RegExp: Set to a RegExp to match against the origin
   * - Array<string | RegExp>: Set to an array of origins to match against the
   *  string or RegExp
   * - Function: Set to a function that will be called with the request origin
   * and should return a boolean indicating if the origin is allowed or not.
   * @default true
   */
  origin?: Origin | ((origin: string) => Promise<Origin>);
  /**
   * Configures the **Access-Control-Allow-Methods** CORS header.
   * @default ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"]
   */
  methods?: Array<string>;
  /**
   * Configures the **Access-Control-Allow-Headers** CORS header.
   * @default []
   */
  allowedHeaders?: string[];
  /**
   * Configures the **Access-Control-Expose-Headers** CORS header.
   * @default []
   */
  exposedHeaders?: string[];
  /**
   * Configures the **Access-Control-Allow-Credentials** CORS header.
   * @default false
   */
  credentials?: boolean;
  /**
   * Configures the **Access-Control-Max-Age** CORS header.
   * @default 0
   */
  maxAge?: number;
}

const DEFAULT_OPTIONS: CORSOptions = {
  origin: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: [],
  exposedHeaders: [],
};

class CORS {
  private options: CORSOptions;
  constructor(options: CORSOptions) {
    // Merge user options with default options
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
  }

  public async exec(request: Request, response: Response): Promise<Response> {
    const isPreflight = request.method.toLowerCase() === 'options';

    await this.configureOrigin(response.headers, request);
    this.configureCredentials(response.headers);
    this.configureExposedHeaders(response.headers);

    if (isPreflight) {
      this.configureMethods(response.headers);
      this.configureAllowedHeaders(response.headers, request);
      this.configureMaxAge(response.headers);

      // waiting for the body
      if (response.status === 204) response.headers.set('Content-Length', '0');
    }

    return response;
  }

  private async resolveOrigin(request: Request) {
    const {origin} = this.options;
    if (typeof origin === 'function') {
      return await origin(request.headers.get('origin') ?? '');
    }
    return origin;
  }

  private configureMaxAge(headers: Headers) {
    const {maxAge} = this.options;

    if (!this.isNumber(maxAge)) return headers;

    headers.append('Access-Control-Max-Age', maxAge.toString());

    return headers;
  }

  private configureExposedHeaders(headers: Headers) {
    const exposedHeaders = this.options.exposedHeaders?.join(',');

    if (!this.isString(exposedHeaders) || exposedHeaders === '') return headers;

    headers.append('Access-Control-Expose-Headers', exposedHeaders);

    return null;
  }

  private configureAllowedHeaders(headers: Headers, request: Request) {
    let allowedHeaders = this.options.allowedHeaders?.join(',');

    if (!allowedHeaders) {
      // headers wasn't specified, so reflect the request headers
      const requestHeaders = request.headers.get(
        'Access-Control-Request-Headers',
      );

      if (this.isString(requestHeaders)) allowedHeaders = requestHeaders;

      headers.append('Vary', 'Access-Control-Request-Headers');
    }

    if (allowedHeaders && allowedHeaders !== '') {
      headers.append('Access-Control-Allow-Headers', allowedHeaders);
    }

    return headers;
  }

  private configureCredentials(headers: Headers) {
    if (this.options.credentials === true) {
      headers.append('Access-Control-Allow-Credentials', 'true');
    }
    return headers;
  }

  private configureMethods(headers: Headers) {
    const methods = this.options.methods?.join(',');

    if (!this.isString(methods)) return headers;

    headers.append('Access-Control-Allow-Methods', methods);

    return headers;
  }

  private async configureOrigin(headers: Headers, request: Request) {
    const origin = await this.resolveOrigin(request);
    const requestOrigin = request.headers.get('origin');

    if (!requestOrigin || origin === false) return headers;

    if (origin === undefined || origin === '*') {
      // allow any origin
      headers.append('Access-Control-Allow-Origin', '*');
      return headers;
    }

    if (this.isString(origin)) {
      // fixed origin
      headers.append('Access-Control-Allow-Origin', origin);
      headers.append('Vary', 'Origin');
      return headers;
    }

    if (!this.isOriginAllowed(requestOrigin, origin)) return headers;

    // reflect origin
    headers.append('Access-Control-Allow-Origin', requestOrigin);
    headers.append('Vary', 'Origin');

    return headers;
  }

  private isOriginAllowed(origin: string, allowedOrigin: Origin) {
    if (Array.isArray(allowedOrigin)) {
      for (const element of allowedOrigin) {
        if (this.isOriginAllowed(origin, element)) return true;
      }
      return false;
    }

    if (this.isString(allowedOrigin)) {
      return origin === allowedOrigin;
    }

    if (allowedOrigin instanceof RegExp) {
      return allowedOrigin.test(origin);
    }

    return !!allowedOrigin;
  }

  private isString(value: unknown): value is string {
    return typeof value === 'string' || value instanceof String;
  }

  private isNumber(value: unknown): value is number {
    return typeof value === 'number' || value instanceof Number;
  }
}

export function cors(options: CORSOptions = DEFAULT_OPTIONS): Micra.Middleware {
  return async function corsMiddleware({request}, next) {
    const response = await next();
    return response ? new CORS(options).exec(request, response) : response;
  };
}
