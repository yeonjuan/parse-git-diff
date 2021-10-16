export default class Context {
  private line: number = 1;
  private lines: string[] = [];
  public constructor(diff: string) {
    this.lines = diff.split('\n');
  }

  public getCurLine(): string {
    return this.lines[this.getInternalIndex()];
  }

  public getCurLineIndex(): number {
    return this.line;
  }

  public nextLine(): string | undefined {
    this.line++;
    return this.getCurLine();
  }

  public eatChars(to: number) {
    const line = this.getCurLine().slice(to);
    this.lines[this.getInternalIndex()] = line;
  }

  public isEof(): boolean {
    return this.line > this.lines.length;
  }

  private getInternalIndex() {
    return this.line - 1;
  }
}
