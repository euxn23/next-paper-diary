export function normalizeDropboxId(rawId: string): string {
  return rawId.replace('id:', '');
}

export function normalizePaperTitle(rawTitle: string): string {
  return rawTitle.replace('.paper', '');
}
