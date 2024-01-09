export const LineType = {
  Added: 'AddedLine',
  Deleted: 'DeletedLine',
  Unchanged: 'UnchangedLine',
  Message: 'MessageLine',
} as const;

export const FileType = {
  Changed: 'ChangedFile',
  Added: 'AddedFile',
  Deleted: 'DeletedFile',
  Renamed: 'RenamedFile',
} as const;

export const ExtendedHeader = {
  Index: 'index',
  Old: 'old',
  Copy: 'copy',
  Similarity: 'similarity',
  Dissimilarity: 'dissimilarity',
  Deleted: 'deleted',
  NewFile: 'new file',
  RenameFrom: 'rename from',
  RenameTo: 'rename to',
} as const;

export const ExtendedHeaderValues = Object.values(ExtendedHeader);

export const NORMAL_CHUNK_RE =
  /^@@\s\-(\d+),?(\d+)?\s\+(\d+),?(\d+)?\s@@\s?(.+)?/;

export const COMBINED_CHUNK_RE =
  /^@@@\s\-(\d+),?(\d+)?\s\-(\d+),?(\d+)?\s\+(\d+),?(\d+)?\s@@@\s?(.+)?/;

export const BINARY_CHUNK_RE = /^Binary\sfiles\s(.*)\sand\s(.*)\sdiffer$/;
