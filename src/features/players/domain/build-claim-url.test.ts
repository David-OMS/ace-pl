import { buildClaimUrl } from "./build-claim-url";

describe("buildClaimUrl", () => {
  it("puts the token on the claim page of the site", () => {
    expect(buildClaimUrl("https://ace-pl.vercel.app", "abc-123")).toBe(
      "https://ace-pl.vercel.app/claim/abc-123",
    );
  });

  it("does not double the slash when the site URL ends with one", () => {
    expect(buildClaimUrl("http://localhost:3000/", "abc")).toBe("http://localhost:3000/claim/abc");
  });
});
