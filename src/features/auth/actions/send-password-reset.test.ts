import { sendPasswordReset } from "./send-password-reset";

const resetPasswordForEmail = vi.fn();

vi.mock("@/lib/supabase/server-client", () => ({
  createSupabaseServerClient: async () => ({ auth: { resetPasswordForEmail } }),
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({ set: vi.fn() }),
}));

function buildForm(fields: Record<string, string>): FormData {
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => form.set(key, value));
  return form;
}

describe("sendPasswordReset", () => {
  beforeEach(() => {
    resetPasswordForEmail.mockReset();
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  it("emails a link that lands on the new-password page", async () => {
    resetPasswordForEmail.mockResolvedValue({ error: null });

    const result = await sendPasswordReset(null, buildForm({ email: " Tunde@Example.com " }));

    expect(result).toEqual({ ok: true, data: { email: "tunde@example.com" } });
    expect(resetPasswordForEmail).toHaveBeenCalledWith("tunde@example.com", {
      redirectTo: "http://localhost:3000/auth/callback?next=%2Fsign-in%2Fnew-password",
    });
  });

  it("rejects a bad email without calling Supabase", async () => {
    const result = await sendPasswordReset(null, buildForm({ email: "nope" }));

    expect(result).toEqual({ ok: false, error: "invalid_input" });
    expect(resetPasswordForEmail).not.toHaveBeenCalled();
  });
});
