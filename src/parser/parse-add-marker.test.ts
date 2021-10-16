import { createContext } from '../test-utils';
import parseAddMarker from './parse-add-marker';

describe('parseAddMarker', () => {
  it('should parse add marker.', () => {
    const src = `+++ b/src/tests/addition.test.ts`;
    const result = parseAddMarker(createContext(src));

    expect(result).not.toBe(null);
    expect(result).toMatchSnapshot();
  });

  it('should not parse delete marker.', () => {
    const src = `--- a/src/tests/addition.test.ts`;
    const result = parseAddMarker(createContext(src));

    expect(result).toBe(null);
  });
});
