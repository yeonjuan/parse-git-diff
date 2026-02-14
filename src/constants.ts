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
  OldMode: 'old mode',
  NewMode: 'new mode',
  Copy: 'copy',
  Similarity: 'similarity',
  Dissimilarity: 'dissimilarity',
  Deleted: 'deleted',
  NewFile: 'new file',
  RenameFrom: 'rename from',
  RenameTo: 'rename to',
} as const;

export const ExtendedHeaderValues = Object.values(ExtendedHeader);
