import {
  isChangeMarkersLines,
  isStartOfDiffChunks,
  isMetaDataLine,
  isComparisonInputLine,
} from './utils';

function parseFileDiff(lines: string[]) {}

export default function parseGitDiff(diff: string): string {
  const lines = diff.split('\n');
  lines.forEach((line, index) => {
    if (index === 0) {
      if (isComparisonInputLine(line)) {
      }
    }
  });
  return 'a';
}
