import * as utils from '../utils';
import * as testUtils from '../testUtils';

describe('utils', () => {
  test('isComparisonInputLine (valid)', () => {
    const cases: [string][] = [['diff --git a/valid.diff b/valid.diff']];
    testUtils.createValidTester(utils.isComparisonInputLine)(cases);
  });

  test('isComparisonInputLine (invalid)', () => {
    const cases: [string][] = [['dif --git a/valid.diff b/valid.diff']];
    testUtils.createInvalidTester(utils.isComparisonInputLine)(cases);
  });

  test('isMetaDataLine (valid)', () => {
    const cases: [string][] = [['index a63c4ac..ac163a4 100644']];
    testUtils.createValidTester(utils.isMetaDataLine)(cases);
  });

  test('isMetaDataLine (invalid)', () => {
    const cases: [string][] = [['inde a63c4ac..ac163a4 100644']];
    testUtils.createInvalidTester(utils.isMetaDataLine)(cases);
  });

  test('isChangeMarkersLines (valid)', () => {
    const cases: [[string, string]][] = [
      [['--- a/diff_test.txt', '+++ b/diff_test.txt']],
    ];
    testUtils.createValidTester(utils.isChangeMarkersLines)(cases);
  });

  test('isChangeMarkersLines (valid)', () => {
    const cases: [string][] = [
      ["@@ -1 +1 @@ describe('utils', () => {"],
      ["@@ -23,15 +23,15 @@ describe('utils', () => {"],
    ];
    testUtils.createValidTester(utils.isStartOfDiffChunks)(cases);
  });
});
