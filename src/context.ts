import { FilledGitDiffOptions, GitDiffOptions } from './types';

export default class Context {
  private lines: Generator<string, any, unknown>;
  public options: FilledGitDiffOptions = {
    noPrefix: false,
  };
  private _currentLine: string;
  private _isEof = false;

  public constructor(
    diff: string | Generator<string, any, unknown>,
    options?: GitDiffOptions
  ) {
    if (typeof diff === 'string') {
      this.lines = this.getGeneratorFromString(diff);
    } else {
      this.lines = diff;
    }

    this._currentLine = this.lines.next().value;

    this.options.noPrefix = !!options?.noPrefix;
  }

  private *getGeneratorFromString(text: string) {
    for (const line of text.split('\n')) {
      yield line;
    }
  }

  public getCurLine(): string {
    return this._currentLine;
  }

  public nextLine(): string | undefined {
    const next = this.lines.next();
    this._isEof = Boolean(next.done);
    this._currentLine = next.value;
    return this.getCurLine();
  }

  public isEof(): boolean {
    return this._isEof;
  }
}

export class AsyncContext {
  public options: FilledGitDiffOptions = {
    noPrefix: false,
  };
  private _currentLine: string = '';
  private _isEof = false;
  private opened = false;

  public constructor(
    private lines: AsyncGenerator<string, any, unknown>,
    options?: GitDiffOptions
  ) {
    this.options.noPrefix = !!options?.noPrefix;
  }

  public async getCurLine(): Promise<string> {
    if (!this.opened) await this.nextLine();
    return this._currentLine;
  }

  public async nextLine(): Promise<string | undefined> {
    this.opened = true;
    const next = await this.lines.next();
    this._isEof = Boolean(next.done);
    this._currentLine = next.value;
    return this.getCurLine();
  }

  public isEof(): boolean {
    return this._isEof;
  }
}
