import {
  parseAdditionMarker,
  parseDeletionMarker,
  parseChangeMarkers,
  parseChunkHeader,
} from '../parse-meta';
import { createContext } from '../test-utils';

describe('parseAdditionMarker', () => {
  it('should parse added marker', () => {
    const context = createContext(`+++ b/src/tests/addition.test.ts`);
    const result = parseAdditionMarker(context);
    expect(result).not.toBe(null);
    expect(result).toMatchInlineSnapshot(`"src/tests/addition.test.ts"`);
  });
});

describe('parseDeletionMarker', () => {
  it('should parse deleted marker', () => {
    const context = createContext(`--- a/src/tests/deletion.test.ts`);
    const result = parseDeletionMarker(context);
    expect(result).not.toBe(null);
    expect(result).toMatchInlineSnapshot(`"src/tests/deletion.test.ts"`);
  });
});

describe('parseChangeMarkers', () => {
  it('should parse change markers', () => {
    const context = createContext(
      // prettier-ignore
      '--- a/src/__tests__/parse-git-diff.test.ts\n' +
      '+++ /dev/null'
    );
    const result = parseChangeMarkers(context);
    expect(result).not.toBe(null);
    expect(result).toMatchInlineSnapshot(`
      Object {
        "added": "/dev/null",
        "deleted": "src/__tests__/parse-git-diff.test.ts",
      }
    `);
  });
});

describe('parseChunkHeader', () => {
  it('should parse chunk header (normal format)', () => {
    const context = createContext(`@@ -0,0 +1,53 @@`);
    const result = parseChunkHeader(context);
    expect(result).not.toBe(null);
    expect(result?.deletedPos.start).toBe(0);
    expect(result?.deletedPos.lines).toBe(0);
    expect(result?.addedPos.start).toBe(1);
    expect(result?.addedPos.lines).toBe(53);
  });

  it('should parse chunk header (concise format)', () => {
    const context = createContext(`@@ -1 +1 @@`);
    const result = parseChunkHeader(context);
    expect(result).not.toBe(null);
    expect(result?.deletedPos.start).toBe(1);
    expect(result?.deletedPos.lines).toBe(1);
    expect(result?.addedPos.start).toBe(1);
    expect(result?.addedPos.lines).toBe(1);
  });
});
