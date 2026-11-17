import { createPlayer } from "./create-player";

const checkAdminAccess = vi.fn();
const insert = vi.fn();
const redirect = vi.fn();

vi.mock("@/features/auth", () => ({ checkAdminAccess: () => checkAdminAccess() }));
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  updateTag: vi.fn(),
  unstable_cache: vi.fn(),
}));
vi.mock("next/navigation", () => ({ redirect: (path: string) => redirect(path) }));
vi.mock("@/lib/supabase/server-client", () => ({
  createSupabaseServerClient: async () => ({ from: () => ({ insert }) }),
}));

function buildForm(fields: Record<string, string>): FormData {
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => form.set(key, value));
  return form;
}

function mockInsertResult(result: { data: { id: string } | null; error: unknown }): void {
  insert.mockReturnValue({ select: () => ({ single: async () => result }) });
}

describe("createPlayer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAdminAccess.mockResolvedValue(null);
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  it("saves a trimmed player and opens their page", async () => {
    mockInsertResult({ data: { id: "player-1" }, error: null });

    await createPlayer(null, buildForm({ name: "  Tunde ", position: "GK" }));

    expect(insert).toHaveBeenCalledWith({ name: "Tunde", position: "GK", is_active: true });
    expect(redirect).toHaveBeenCalledWith("/admin/players/player-1");
  });

  it("rejects an unknown position or a blank name", async () => {
    expect(await createPlayer(null, buildForm({ name: "Seyi", position: "WINGER" }))).toEqual({
      ok: false,
      error: "invalid_input",
    });
    expect(await createPlayer(null, buildForm({ name: "   ", position: "MID" }))).toEqual({
      ok: false,
      error: "invalid_input",
    });
    expect(insert).not.toHaveBeenCalled();
  });

  it("refuses non-admins", async () => {
    checkAdminAccess.mockResolvedValue("forbidden");

    const result = await createPlayer(null, buildForm({ name: "Seyi", position: "MID" }));

    expect(result).toEqual({ ok: false, error: "forbidden" });
    expect(insert).not.toHaveBeenCalled();
  });

  it("reports a database failure without redirecting", async () => {
    mockInsertResult({ data: null, error: { message: "boom" } });

    const result = await createPlayer(null, buildForm({ name: "Seyi", position: "MID" }));

    expect(result).toEqual({ ok: false, error: "save_failed" });
    expect(redirect).not.toHaveBeenCalled();
  });
});
