import { LineType, FileType } from './constants';

export interface Base<Type extends string> {
  readonly type: Type;
}

interface BaseChange<Type extends string> extends Base<Type> {
  content: string;
}

export interface AddedLine extends BaseChange<typeof LineType.Added> {
  lineAfter: number;
}

export interface DeletedLine extends BaseChange<typeof LineType.Deleted> {
  lineBefore: number;
}

export interface UnchangedLine extends BaseChange<typeof LineType.Unchanged> {
  lineBefore: number;
  lineAfter: number;
}

export type AnyLineChange = AddedLine | DeletedLine | UnchangedLine;

export interface ChunkRange {
  start: number;
  lines: number;
}

export interface Chunk extends Base<'Chunk'> {
  rangeBefore: ChunkRange;
  rangeAfter: ChunkRange;
  changes: AnyLineChange[];
}

export interface CombinedChunk extends Base<'CombinedChunk'> {
  rangeBeforeA: ChunkRange;
  rangeBeforeB: ChunkRange;
  rangeAfter: ChunkRange;
  changes: AnyLineChange[];
}

export type AnyChunk = Chunk | CombinedChunk;

export interface ChangedFile extends Base<typeof FileType.Changed> {
  path: string;
  chunks: AnyChunk[];
}

export interface AddedFile extends Base<typeof FileType.Added> {
  path: string;
  chunks: AnyChunk[];
}

export interface DeletedFile extends Base<typeof FileType.Deleted> {
  path: string;
  chunks: AnyChunk[];
}

export interface RenamedFile extends Base<typeof FileType.Renamed> {
  pathBefore: string;
  pathAfter: string;
  chunks: AnyChunk[];
}

export type AnyFileChange = ChangedFile | AddedFile | DeletedFile | RenamedFile;

export interface GitDiff extends Base<'GitDiff'> {
  files: AnyFileChange[];
}
