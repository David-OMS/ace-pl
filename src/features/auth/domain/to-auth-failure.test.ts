import { toAuthFailure } from "./to-auth-failure";

describe("toAuthFailure", () => {
  it("treats a wrong password as something the person can fix", () => {
    expect(toAuthFailure({ status: 400, code: "invalid_credentials" })).toBe("invalid_input");
  });

  it("tells an existing email to sign in instead of creating another account", () => {
    expect(toAuthFailure({ status: 422, code: "user_already_exists" })).toBe("conflict");
    expect(toAuthFailure({ status: 422, code: "email_exists" })).toBe("conflict");
  });

  it("keeps the mail cap separate from a broken request", () => {
    expect(toAuthFailure({ status: 429, code: "over_request_rate_limit" })).toBe("rate_limited");
    expect(toAuthFailure({ status: 500 })).toBe("request_failed");
  });
});
