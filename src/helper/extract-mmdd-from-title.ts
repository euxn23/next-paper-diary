export function extractYyyymmddFromTitle(title: string): string | null {
  const match = title.match(/^(\d\d\d\d\d\d\d\d)_/);

  return match ? match[0] : null;
}
