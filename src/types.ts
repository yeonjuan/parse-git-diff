interface Base {
  readonly type: string;
}

export interface GitDiff extends Base {
  type: 'GitDiff';
  changedFiles: FileDiff[];
}

interface Change extends Base {
  type: 'Change';
}

export interface FileDiff extends Base {
  readonly type: 'FileDiff';
  changes: Change[];
}

export type ComparisonInputLine = `diff --git ${string} ${string}`;
export type MetaDataLine = `index ${string}`;
export type FirstChangeMarker = `--- ${string}`;
export type SecondChangeMarker = `+++ ${string}`;
export type StartOfDiffChunks = `@@ -${string} +${string} @@`;
export type AdditionLine = `+${string}`;
export type DeletionLine = `-${string}`;
