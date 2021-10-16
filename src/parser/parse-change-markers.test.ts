import { createContext } from '../test-utils';
import parseChangeMarkers from './parse-change-markers';

describe('parseChangeMarkers', () => {
  it('should parse change markers.', () => {
    // prettier-ignore
    const src =
`--- a/src/tests/addition.test.ts
+++ b/src/tests/addition.test.ts`;

    const result = parseChangeMarkers(createContext(src));

    expect(result).not.toBe(null);
    expect(result).toMatchSnapshot();
  });
});
