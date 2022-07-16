export interface TypedResponse<T = unknown> extends Response {
  json(): Promise<T>;
}
