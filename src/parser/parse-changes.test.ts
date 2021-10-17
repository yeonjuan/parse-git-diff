import { createContext } from '../test-utils';
import parseChanges from './parse-changes';

describe('parseChanges', () => {
  it('should parse changes.', () => {
    // prettier-ignore
    const src =
` unchanged
 -deleted line
 +added line
 unchanged`;

    const result = parseChanges(
      createContext(src),
      {
        lines: 4,
        start: 1,
      },
      {
        lines: 4,
        start: 1,
      }
    );

    expect(result).not.toBe(null);
    expect(result).toMatchSnapshot();
  });
});
