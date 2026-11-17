import { sendMagicLink } from "./send-magic-link";

const signInWithOtp = vi.fn();

vi.mock("@/lib/supabase/server-client", () => ({
  createSupabaseServerClient: async () => ({ auth: { signInWithOtp } }),
}));

function buildForm(fields: Record<string, string>): FormData {
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => form.set(key, value));
  return form;
}

describe("sendMagicLink", () => {
  beforeEach(() => {
    signInWithOtp.mockReset();
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  it("sends a link that returns the user to where they started", async () => {
    signInWithOtp.mockResolvedValue({ error: null });

    const result = await sendMagicLink(
      null,
      buildForm({ email: "  Tunde@Example.com ", next: "/fantasy" }),
    );

    expect(result).toEqual({ ok: true, data: { email: "tunde@example.com" } });
    expect(signInWithOtp).toHaveBeenCalledWith({
      email: "tunde@example.com",
      options: { emailRedirectTo: "http://localhost:3000/auth/callback?next=%2Ffantasy" },
    });
  });

  it("rejects an invalid email without calling Supabase", async () => {
    const result = await sendMagicLink(null, buildForm({ email: "not-an-email" }));

    expect(result).toEqual({ ok: false, error: "invalid_input" });
    expect(signInWithOtp).not.toHaveBeenCalled();
  });

  it("ignores a return path that points to another site", async () => {
    signInWithOtp.mockResolvedValue({ error: null });

    await sendMagicLink(null, buildForm({ email: "a@b.co", next: "https://evil.com" }));

    expect(signInWithOtp.mock.calls[0]?.[0].options.emailRedirectTo).toBe(
      "http://localhost:3000/auth/callback?next=%2F",
    );
  });

  it("reports rate limiting separately so the user knows to wait", async () => {
    signInWithOtp.mockResolvedValue({ error: { status: 429, message: "rate limit" } });

    const result = await sendMagicLink(null, buildForm({ email: "a@b.co" }));

    expect(result).toEqual({ ok: false, error: "rate_limited" });
  });

  it("reports other Supabase failures as a failed request", async () => {
    signInWithOtp.mockResolvedValue({ error: { status: 500, message: "boom" } });

    const result = await sendMagicLink(null, buildForm({ email: "a@b.co" }));

    expect(result).toEqual({ ok: false, error: "request_failed" });
  });
});
