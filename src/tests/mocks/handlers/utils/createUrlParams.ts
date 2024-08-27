export function createUrlParams(
  baseUrl: string,
  params: Record<string, string | number | boolean>,
) {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value.toString());
  });
  return url.toString();
}
