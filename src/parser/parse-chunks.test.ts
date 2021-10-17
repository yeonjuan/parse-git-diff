import { createContext } from '../test-utils';
import parseChunks from './parse-chunks';

describe('parseChunks', () => {
  it('should parse chunks.', () => {
    // prettier-ignore
    const src =
`@@ -18,7 +18,7 @@ export type AnyChange = Added | Deleted | Unchanged;
 /** changed file types */
 
 interface BaseFileChange<Type extends string> extends Base<Type> {
-  hunks: Hunk[];
+  chunks: Chunk[];
 }
 
 export interface ChangedFile extends BaseFileChange<'ChangedFile'> {}
@@ -40,13 +40,13 @@ export type AnyFileChange = ChangedFile | AddedFile | DeletedFile | RenamedFile;
 
 /** hunk */
 
-export interface HunkPos {
+export interface ChunkPos {
   start: number;
   lines: number;
 }
 
-export interface Hunk extends Base<'Hunk'> {
-  addedPos: HunkPos;
-  deletedPos: HunkPos;
+export interface Chunk extends Base<'Hunk'> {
+  addedPos: ChunkPos;
+  deletedPos: ChunkPos;
   changes: AnyChange[];
 }`;
    const result = parseChunks(createContext(src));

    expect(result).not.toBe(null);
    expect(result).toMatchSnapshot();
  });

  it('should parse chunks 2.', () => {
    // prettier-ignore
    const src =
`@@ -18,7 +18,7 @@
 /** changed file types */
 
 interface BaseFileChange<Type extends string> extends Base<Type> {
-  hunks: Hunk[];
+  chunks: Chunk[];
 }
 
 export interface ChangedFile extends BaseFileChange<'ChangedFile'> {}
@@ -40,13 +40,13 @@ export type AnyFileChange = ChangedFile | AddedFile | DeletedFile | RenamedFile;
 
 /** hunk */
 
-export interface HunkPos {
+export interface ChunkPos {
   start: number;
   lines: number;
 }
 
-export interface Hunk extends Base<'Hunk'> {
-  addedPos: HunkPos;
-  deletedPos: HunkPos;
+export interface Chunk extends Base<'Hunk'> {
+  addedPos: ChunkPos;
+  deletedPos: ChunkPos;
   changes: AnyChange[];
 }`;
    const result = parseChunks(createContext(src));

    expect(result).not.toBe(null);
    expect(result).toMatchSnapshot();
  });
});
