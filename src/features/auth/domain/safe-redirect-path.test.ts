import { toSafeRedirectPath } from "./safe-redirect-path";

describe("toSafeRedirectPath", () => {
  it("keeps a path on this site", () => {
    expect(toSafeRedirectPath("/fantasy?tab=squad")).toBe("/fantasy?tab=squad");
  });

  it.each([
    ["a missing value", null],
    ["a non-string value", 42],
    ["an empty string", ""],
    ["a full URL to another site", "https://evil.com"],
    ["a protocol-relative URL", "//evil.com"],
    ["a backslash trick", "/\\evil.com"],
    ["a relative path", "fantasy"],
  ])("falls back to the home page for %s", (_description, candidate) => {
    expect(toSafeRedirectPath(candidate)).toBe("/");
  });
});
