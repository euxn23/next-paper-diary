import { files } from 'dropbox';

export function entryFilter(
  entry: files.ListFolderResult['entries'][number]
): entry is files.FileMetadataReference {
  return entry['.tag'] === 'file';
}
