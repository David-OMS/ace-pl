import { buildAuthCallbackUrl } from "./build-auth-callback-url";

describe("buildAuthCallbackUrl", () => {
  it("points at the callback route and carries the return path", () => {
    expect(buildAuthCallbackUrl("https://acepl.vercel.app", "/fantasy")).toBe(
      "https://acepl.vercel.app/auth/callback?next=%2Ffantasy",
    );
  });

  it("ignores a trailing slash on the site URL", () => {
    expect(buildAuthCallbackUrl("http://localhost:3000/", "/")).toBe(
      "http://localhost:3000/auth/callback?next=%2F",
    );
  });
});
