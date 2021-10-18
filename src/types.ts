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

interface BaseFileChange<Type extends string> extends Base<Type> {
  chunks: Chunk[];
}

export interface ChangedFile extends BaseFileChange<typeof FileType.Changed> {
  path: string;
}

export interface AddedFile extends BaseFileChange<typeof FileType.Added> {
  path: string;
}

export interface DeletedFile extends BaseFileChange<typeof FileType.Deleted> {
  path: string;
}

export interface RenamedFile extends BaseFileChange<typeof FileType.Renamed> {
  pathBefore: string;
  pathAfter: string;
}

export type AnyFileChange = ChangedFile | AddedFile | DeletedFile | RenamedFile;

export interface GitDiff extends Base<'GitDiff'> {
  files: AnyFileChange[];
}
