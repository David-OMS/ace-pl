import { signInWithPassword } from "./sign-in-with-password";

const signInWithPasswordAuth = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: (path: string): never => {
    throw Object.assign(new Error("NEXT_REDIRECT"), { path });
  },
}));

vi.mock("@/lib/supabase/server-client", () => ({
  createSupabaseServerClient: async () => ({
    auth: { signInWithPassword: signInWithPasswordAuth },
  }),
}));

function buildForm(fields: Record<string, string>): FormData {
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => form.set(key, value));
  return form;
}

describe("signInWithPassword", () => {
  beforeEach(() => {
    signInWithPasswordAuth.mockReset();
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  it("signs in and sends the person back where they started", async () => {
    signInWithPasswordAuth.mockResolvedValue({ error: null });

    await expect(
      signInWithPassword(
        null,
        buildForm({ email: " Tunde@Example.com ", password: "pitchpass", next: "/fantasy" }),
      ),
    ).rejects.toMatchObject({ path: "/fantasy" });

    expect(signInWithPasswordAuth).toHaveBeenCalledWith({
      email: "tunde@example.com",
      password: "pitchpass",
    });
  });

  it("rejects a short password without calling Supabase", async () => {
    const result = await signInWithPassword(
      null,
      buildForm({ email: "a@b.co", password: "short" }),
    );

    expect(result).toEqual({ ok: false, error: "invalid_input" });
    expect(signInWithPasswordAuth).not.toHaveBeenCalled();
  });

  it("reports a wrong password as something to retype", async () => {
    signInWithPasswordAuth.mockResolvedValue({
      error: { status: 400, code: "invalid_credentials", message: "nope" },
    });

    const result = await signInWithPassword(
      null,
      buildForm({ email: "a@b.co", password: "pitchpass" }),
    );

    expect(result).toEqual({ ok: false, error: "invalid_input" });
  });
});
