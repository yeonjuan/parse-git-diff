import parseGitDiff from "../parse-git-diff";

describe("parse-git-diff", () => {
  test("test", () => {
    expect(parseGitDiff("a")).toBe("a");
  });
});
