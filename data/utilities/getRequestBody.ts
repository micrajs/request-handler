export async function getRequestBody(
  request: Request,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<Record<string, any>> {
  try {
    return await request.clone().json();
  } catch (_err) {
    return {};
  }
}
