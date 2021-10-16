import type { Base } from './common';
import type { AnyFileChange } from './changes';

export interface GitDiff extends Base<'GitDiff'> {
  changedFiles: AnyFileChange[];
}
