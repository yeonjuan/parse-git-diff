import parseGitDiff from './parse-git-diff.js';
export default parseGitDiff;

export type {
  AddedLine,
  DeletedLine,
  UnchangedLine,
  MessageLine,
  AnyLineChange,
  ChunkRange,
  Chunk,
  CombinedChunk,
  AnyChunk,
  ChangedFile,
  AddedFile,
  DeletedFile,
  RenamedFile,
  AnyFileChange,
  GitDiff,
} from './types.js';
