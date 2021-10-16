import { createContext } from '../test-utils';
import parseDeleteMarker from './parse-delete-marker';

describe('parseDeleteMarker', () => {
  it('should parse delete marker.', () => {
    const src = `--- a/src/tests/delete.test.ts`;
    const result = parseDeleteMarker(createContext(src));

    expect(result).not.toBe(null);
    expect(result).toMatchSnapshot();
  });

  it('should not parse add marker.', () => {
    const src = `+++ b/src/tests/delete.test.ts`;
    const result = parseDeleteMarker(createContext(src));

    expect(result).toBe(null);
  });
});
