export async function getRequestBody(
  request: Request,
): Promise<Record<string, any>> {
  try {
    return await request.clone().json();
  } catch (_err) {
    return {};
  }
}
