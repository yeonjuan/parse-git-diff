import type { Base } from './common';

/** changed content types */

interface BaseChange<Type extends string> extends Base<Type> {
  content: string;
}

export interface Added extends BaseChange<'Added'> {
  lineAfter: number;
}

export interface Deleted extends BaseChange<'Deleted'> {
  lineBefore: number;
}

export interface Unchanged extends BaseChange<'Unchanged'> {
  lineBefore: number;
  lineAfter: number;
}

export type AnyChange = Added | Deleted | Unchanged;

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
  from: string;
  to: string;
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
  changes: AnyChange[];
}
