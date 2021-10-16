import type * as t from '../types';

/**
 * Checks whether a line is a comparison input line or not.
 * @param {string} line The line to check.
 * @returns {boolean} Returns `true` if the given line is a comparison line, otherwise `false`.
 * @example
 * // comparison input line.
 * "diff --git a/file.txt b/file.txt"
 */
export function isComparisonInputLine(line: string): boolean {
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
export function isMetaDataLine(line: string): boolean {
  return /^index/.test(line);
}

export function isAddMarkerLine(line: string): boolean {
  return /^\+\+\+\s/.test(line);
}

export function isDeleteMarkerLine(line: string): boolean {
  return /^\-\-\-\s/.test(line);
}

/**
 * Checks whether the line is a chunk header or not
 * @param line The line to check.
 * @returns return `true` if the given line is a chunk header, otherwise `false`.
 * @example
 * // start line of diff chunks
 * "@@ -1 +1 @@ describe('utils', () => {..."
 * "@@ -23,15 +23,15 @@ describe('utils', () => { ..."
 */
export function isChunkHeader(line: string): boolean {
  return /^@@\s\-\d+(,\d+)?\s\+\d+(,\d+)?\s@@\s?/.test(line);
} // test

/**
 * Checks whether the line is an addition line.
 * @param {string} line The line to check.
 * @returns {boolean} Return `true` if the given line is an addition line, otherwise `false`.
 */
export function isAdditionLine(line: string): boolean {
  return line[0] === '+';
}

/**
 * Checks whether the line is an deletion line.
 * @param {string} line The line to check.
 * @returns {boolean} Return `true` if the given line is an deletion line, otherwise `false`.
 */
export function isDeletionLine(line: string): boolean {
  return line[0] === '-';
}

export function isUnchangedLine(line: string): boolean {
  return line[0] === ' ';
}
