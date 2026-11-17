import { completeSignIn } from "./complete-sign-in";

const exchangeCodeForSession = vi.fn();

vi.mock("@/lib/supabase/server-client", () => ({
  createSupabaseServerClient: async () => ({ auth: { exchangeCodeForSession } }),
}));

describe("completeSignIn", () => {
  beforeEach(() => {
    exchangeCodeForSession.mockReset();
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  it("sends the user on to the page they came from", async () => {
    exchangeCodeForSession.mockResolvedValue({ error: null });

    await expect(completeSignIn("code-123", "/fantasy")).resolves.toBe("/fantasy");
    expect(exchangeCodeForSession).toHaveBeenCalledWith("code-123");
  });

  it("goes home when the return path is unsafe", async () => {
    exchangeCodeForSession.mockResolvedValue({ error: null });

    await expect(completeSignIn("code-123", "//evil.com")).resolves.toBe("/");
  });

  it("returns to sign-in with an error when the link has no code", async () => {
    await expect(completeSignIn(null, "/")).resolves.toBe("/sign-in?error=link");
    expect(exchangeCodeForSession).not.toHaveBeenCalled();
  });

  it("returns to sign-in with an error when the code is expired or reused", async () => {
    exchangeCodeForSession.mockResolvedValue({ error: { message: "invalid grant" } });

    await expect(completeSignIn("old-code", "/")).resolves.toBe("/sign-in?error=link");
  });
});
