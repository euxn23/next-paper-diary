export function isMatchImageURL(url: string): boolean {
  return url.match(/\.(jpeg|png)$/) !== null;
}