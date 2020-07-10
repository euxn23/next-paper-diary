export function extractMmddFromTitle(title: string): string | null {
  const match = title.match(/^(\d\d\d\d)_/);

  return match ? match[0] : null;
}
