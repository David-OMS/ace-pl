import { signUpWithPassword } from "./sign-up-with-password";

const signUp = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: (path: string): never => {
    throw Object.assign(new Error("NEXT_REDIRECT"), { path });
  },
}));

vi.mock("@/lib/supabase/server-client", () => ({
  createSupabaseServerClient: async () => ({ auth: { signUp } }),
}));

function buildForm(fields: Record<string, string>): FormData {
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => form.set(key, value));
  return form;
}

describe("signUpWithPassword", () => {
  beforeEach(() => {
    signUp.mockReset();
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  it("stores the player name and signs them straight in", async () => {
    signUp.mockResolvedValue({ data: { session: { access_token: "token" } }, error: null });

    await expect(
      signUpWithPassword(
        null,
        buildForm({
          name: " Brymo ",
          email: "a@b.co",
          password: "pitchpass",
          next: "/claim/token",
        }),
      ),
    ).rejects.toMatchObject({ path: "/claim/token" });

    expect(signUp).toHaveBeenCalledWith({
      email: "a@b.co",
      password: "pitchpass",
      options: { data: { full_name: "Brymo" } },
    });
  });

  it("asks them to open a confirm email when Supabase does not start a session", async () => {
    signUp.mockResolvedValue({ data: { session: null }, error: null });

    const result = await signUpWithPassword(
      null,
      buildForm({ name: "Brymo", email: "a@b.co", password: "pitchpass" }),
    );

    expect(result).toEqual({ ok: true, data: { email: "a@b.co" } });
  });

  it("sends an existing email to sign in", async () => {
    signUp.mockResolvedValue({
      data: { session: null },
      error: { status: 422, code: "user_already_exists", message: "registered" },
    });

    const result = await signUpWithPassword(
      null,
      buildForm({ name: "Brymo", email: "a@b.co", password: "pitchpass" }),
    );

    expect(result).toEqual({ ok: false, error: "conflict" });
  });
});
