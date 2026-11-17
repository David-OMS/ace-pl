import { signUpWithPassword } from "./sign-up-with-password";

const createUser = vi.fn();
const signInWithPassword = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: (path: string): never => {
    throw Object.assign(new Error("NEXT_REDIRECT"), { path });
  },
}));

vi.mock("@/lib/supabase/admin-client", () => ({
  createSupabaseAdminClient: () => ({ auth: { admin: { createUser } } }),
}));

vi.mock("@/lib/supabase/server-client", () => ({
  createSupabaseServerClient: async () => ({ auth: { signInWithPassword } }),
}));

function buildForm(fields: Record<string, string>): FormData {
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => form.set(key, value));
  return form;
}

describe("signUpWithPassword", () => {
  beforeEach(() => {
    createUser.mockReset();
    signInWithPassword.mockReset();
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  it("creates the account with no confirm email and signs them in", async () => {
    createUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    signInWithPassword.mockResolvedValue({ error: null });

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

    expect(createUser).toHaveBeenCalledWith({
      email: "a@b.co",
      password: "pitchpass",
      email_confirm: true,
      user_metadata: { full_name: "Brymo" },
    });
    expect(signInWithPassword).toHaveBeenCalledWith({
      email: "a@b.co",
      password: "pitchpass",
    });
  });

  it("sends an existing email to sign in", async () => {
    createUser.mockResolvedValue({
      data: { user: null },
      error: { status: 422, code: "user_already_exists", message: "registered" },
    });

    const result = await signUpWithPassword(
      null,
      buildForm({ name: "Brymo", email: "a@b.co", password: "pitchpass" }),
    );

    expect(result).toEqual({ ok: false, error: "conflict" });
    expect(signInWithPassword).not.toHaveBeenCalled();
  });
});
