export function entryFilter(
  entry: DropboxTypes.files.ListFolderResult['entries'][number]
): entry is DropboxTypes.files.FileMetadataReference {
  return entry['.tag'] === 'file';
}
