import { toSignInError } from "./routes";

describe("toSignInError", () => {
  it("recognises the errors the sign-in page knows how to explain", () => {
    expect(toSignInError("link")).toBe("link");
    expect(toSignInError("google")).toBe("google");
  });

  it("ignores anything else in the URL", () => {
    expect(toSignInError("<script>")).toBeNull();
    expect(toSignInError(undefined)).toBeNull();
  });
});
