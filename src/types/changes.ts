import type { Base } from './common';

/** changed content types */

interface BaseChange<Type extends string> extends Base<Type> {
  content: string;
}

export interface AddedLine extends BaseChange<'AddedLine'> {
  lineAfter: number;
}

export interface DeletedLine extends BaseChange<'DeletedLine'> {
  lineBefore: number;
}

export interface UnchangedLine extends BaseChange<'UnchangedLine'> {
  lineBefore: number;
  lineAfter: number;
}

export type AnyLineChange = AddedLine | DeletedLine | UnchangedLine;

/** changed file types */

interface BaseFileChange<Type extends string> extends Base<Type> {
  chunks: Chunk[];
}

export interface ChangedFile extends BaseFileChange<'ChangedFile'> {
  path: string;
}

export interface AddedFile extends BaseFileChange<'AddedFile'> {
  path: string;
}

export interface DeletedFile extends BaseFileChange<'DeletedFile'> {
  path: string;
}

export interface RenamedFile extends BaseFileChange<'RenamedFile'> {
  pathBefore: string;
  pathAfter: string;
}

export type AnyFileChange = ChangedFile | AddedFile | DeletedFile | RenamedFile;

/** hunk */

export interface ChunkRange {
  start: number;
  lines: number;
}

export interface Chunk extends Base<'Chunk'> {
  rangeBefore: ChunkRange;
  rangeAfter: ChunkRange;
  changes: AnyLineChange[];
}
