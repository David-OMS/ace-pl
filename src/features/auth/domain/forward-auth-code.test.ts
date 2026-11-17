import { forwardAuthCode } from "./forward-auth-code";

describe("forwardAuthCode", () => {
  it("leaves ordinary visits alone", () => {
    const current = new URL("https://ace-pl.vercel.app/");

    expect(forwardAuthCode(current, false)).toBeNull();
    expect(forwardAuthCode(current, true)).toBeNull();
  });

  it("sends a reset code that landed on the home page to the new-password screen", () => {
    const current = new URL("https://ace-pl.vercel.app/?code=abc");

    expect(forwardAuthCode(current, true)?.toString()).toBe(
      "https://ace-pl.vercel.app/auth/callback?code=abc&next=%2Fsign-in%2Fnew-password",
    );
  });

  it("does not send a home-page code onward when this browser did not ask for a reset", () => {
    const current = new URL("https://ace-pl.vercel.app/?code=abc");

    expect(forwardAuthCode(current, false)).toBeNull();
  });

  it("leaves a code that is already on the callback", () => {
    const current = new URL("https://ace-pl.vercel.app/auth/callback?code=abc");

    expect(forwardAuthCode(current, true)).toBeNull();
  });
});
