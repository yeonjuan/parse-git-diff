import { LineType, FileType } from './constants.js';

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

export interface MessageLine extends BaseChange<typeof LineType.Message> {
  content: string;
}

export type AnyLineChange =
  | AddedLine
  | DeletedLine
  | UnchangedLine
  | MessageLine;

export interface ChunkRange {
  start: number;
  lines: number;
}

export interface Chunk extends Base<'Chunk'> {
  fromFileRange: ChunkRange;
  toFileRange: ChunkRange;
  changes: AnyLineChange[];
  context: string | undefined;
}

export interface CombinedChunk extends Base<'CombinedChunk'> {
  fromFileRangeA: ChunkRange;
  fromFileRangeB: ChunkRange;
  toFileRange: ChunkRange;
  changes: AnyLineChange[];
  context: string | undefined;
}

export interface BinaryFilesChunk extends Base<'BinaryFilesChunk'> {
  pathBefore: string;
  pathAfter: string;
}

export type AnyChunk = Chunk | CombinedChunk | BinaryFilesChunk;

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
