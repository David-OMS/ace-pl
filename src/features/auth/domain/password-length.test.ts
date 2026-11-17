import { isUsablePassword, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "./password-length";

describe("isUsablePassword", () => {
  it("accepts a password at the minimum length", () => {
    expect(isUsablePassword("a".repeat(PASSWORD_MIN_LENGTH))).toBe(true);
  });

  it("rejects a short password", () => {
    expect(isUsablePassword("a".repeat(PASSWORD_MIN_LENGTH - 1))).toBe(false);
  });

  it("rejects a password past the bcrypt limit", () => {
    expect(isUsablePassword("a".repeat(PASSWORD_MAX_LENGTH + 1))).toBe(false);
  });
});
