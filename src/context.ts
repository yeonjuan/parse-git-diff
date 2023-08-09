import { FilledGitDiffOptions, GitDiffOptions } from './types';

export default class Context {
  private line: number = 1;
  private lines: string[] = [];
  public options: FilledGitDiffOptions = {
    noPrefix: false,
  };
  public constructor(diff: string, options?: GitDiffOptions) {
    this.lines = diff.split('\n');

    this.options.noPrefix = !!options?.noPrefix;
  }

  public getCurLine(): string {
    return this.lines[this.line - 1];
  }

  public nextLine(): string | undefined {
    this.line++;
    return this.getCurLine();
  }

  public isEof(): boolean {
    return this.line > this.lines.length;
  }
}
