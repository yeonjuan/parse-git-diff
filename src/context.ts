export default class Context {
  private line: number = 0;
  private lines: string[] = [];
  public constructor(diff: string) {
    this.lines = diff.split('\n');
  }

  public getCurLine(): string | undefined {
    return this.lines[this.line];
  }

  public nextLine(): string | undefined {
    this.line++;
    return this.getCurLine();
  }

  public isEof(): boolean {
    return this.line >= this.lines.length;
  }
}
