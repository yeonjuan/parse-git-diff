import { createContext } from '../test-utils';
import parseChunkHeader from './parse-chunk-header';

describe('parseChunkHeader', () => {
  it('should parse normal chunk header.', () => {
    const src = `@@ -3,71 +3,4 @@`;
    const result = parseChunkHeader(createContext(src));

    expect(result).not.toBe(null);
    expect(result).toMatchSnapshot();
  });

  it('should parse concise chunk header', () => {
    const src = `@@ -1 +1 @@`;
    const result = parseChunkHeader(createContext(src));

    expect(result).not.toBe(null);
    expect(result).toMatchSnapshot();
  });
});
