import type { Base } from './common';
import type { AnyFileChange } from './changes';

export interface GitDiff extends Base<'GitDiff'> {
  files: AnyFileChange[];
}
