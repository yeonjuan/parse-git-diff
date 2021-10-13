import type * as t from './types';

/**
 * Checks whether a line is a comparison input line or not.
 * @param {string} line The line to check.
 * @returns {boolean} Returns `true` if the given line is a comparison line, otherwise `false`.
 * @example
 * // comparison input line.
 * "diff --git a/file.txt b/file.txt"
 */
export function isComparisonInputLine(
  line: string
): line is t.ComparisonInputLine {
  const [diff, doubleDashGit, fileA, fileB, rest] = line.split(' ');
  return !!(
    diff === 'diff' &&
    doubleDashGit === '--git' &&
    fileA &&
    fileB &&
    !rest
  );
}

/**
 * Checks whether a line is a meta data line or not.
 * @param line The line to check.
 * @returns {boolean} Return `true` if the given line is a meta data line, otherwise `false`.
 * @example
 * // meta data line.
 * "index 6b0c6cf..b37e70a 100644"
 */
export function isMetaDataLine(line: string): line is t.MetaDataLine {
  return /^index/.test(line);
}

/**
 * Checks whether the two lines are change markers or not.
 * @param first The first line.
 * @param second The second line.
 * @returns {boolean} Return `true` if the given two lines are change markers, otherwise `false`.
 * @example
 * // change markers
 * "--- a/file.txt"
 * "+++ b/file.txt"
 */
export function isChangeMarkersLines(
  twoLines: [string, string]
): twoLines is [t.FirstChangeMarker, t.SecondChangeMarker] {
  return /^\-\-\-\s/.test(twoLines[0]) && /^\+\+\+\s/.test(twoLines[1]);
}

/**
 * Checks whether the line is a start line of the diff chunks
 * @param line The line to check.
 * @returns return `true` if the given line is the start of diff chunks, otherwise `false`.
 * @example
 * // start line of diff chunks
 * "@@ -1 +1 @@ describe('utils', () => {...
 * "@@ -23,15 +23,15 @@ describe('utils', () => { ..."
 */
export function isStartOfDiffChunks(line: string): line is t.StartOfDiffChunks {
  return /^@@\s\-\d+(,\d+)?\s\+\d+(,\d+)?\s@@\s/.test(line);
}

/**
 * Checks whether the line is an addition line.
 * @param {string} line The line to check.
 * @returns {boolean} Return `true` if the given line is an addition line, otherwise `false`.
 */
export function isAdditionLine(line: string): line is t.AdditionLine {
  return /^\+/.test(line);
}

/**
 * Checks whether the line is an deletion line.
 * @param {string} line The line to check.
 * @returns {boolean} Return `true` if the given line is an deletion line, otherwise `false`.
 */
export function isDeletionLine(line: string): line is t.DeletionLine {
  return /^\-/.test(line);
}
