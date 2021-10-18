export default class Context {
  private line: number = 1;
  private lines: string[] = [];
  public constructor(diff: string) {
    this.lines = diff.split('\n');
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
