import type { Interface } from 'node:readline';
import { FilledGitDiffOptions, GitDiffOptions } from './types';
import { isReadlineInterface } from './utils';

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
  private lines: AsyncGenerator<string, any, unknown>;

  public constructor(
    diff: AsyncGenerator<string, any, unknown> | Interface,
    options?: GitDiffOptions
  ) {
    if (isReadlineInterface(diff)) {
      this.lines = this.getGenerator(diff);
    } else {
      this.lines = diff;
    }

    this.options.noPrefix = !!options?.noPrefix;
  }

  async *getGenerator(stream: Interface) {
    for await (const line of stream) {
      yield line;
    }
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
