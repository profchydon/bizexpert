export function resolveAxiosRequestUrl(baseUrl: string, url: string) {
  if (/^https?:\/\//i.test(url)) return url;
  return `${baseUrl}${url}`;
}
