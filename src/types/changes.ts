import type { Base } from './common';

/** changed content types */

interface BaseChange<Type extends string> extends Base<Type> {
  line: number;
  content: string;
}

export interface Added extends BaseChange<'Added'> {}

export interface Deleted extends BaseChange<'Deleted'> {}

export interface Unchanged extends BaseChange<'Unchanged'> {}

export type AnyChange = Added | Deleted | Unchanged;

/** changed file types */

interface BaseFileChange<Type extends string> extends Base<Type> {
  chunks: Chunk[];
}

export interface ChangedFile extends BaseFileChange<'ChangedFile'> {}

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

export interface ChunkPos {
  start: number;
  lines: number;
}

export interface Chunk extends Base<'Chunk'> {
  addedPos: ChunkPos;
  deletedPos: ChunkPos;
  changes: AnyChange[];
}
