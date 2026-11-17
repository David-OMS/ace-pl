import { claimPlayer } from "./claim-player";

const rpc = vi.fn();
const redirect = vi.fn();

vi.mock("next/navigation", () => ({ redirect: (path: string) => redirect(path) }));
vi.mock("@/lib/supabase/server-client", () => ({
  createSupabaseServerClient: async () => ({ rpc }),
}));

const VALID_TOKEN = "6f1c2b9e-3d4a-4b5c-8d7e-1f2a3b4c5d6e";

function buildForm(token: string): FormData {
  const form = new FormData();
  form.set("token", token);
  return form;
}

describe("claimPlayer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  it("links the account and sends the player home", async () => {
    rpc.mockResolvedValue({ data: "player-1", error: null });

    await claimPlayer(null, buildForm(VALID_TOKEN));

    expect(rpc).toHaveBeenCalledWith("claim_player", { claim_token: VALID_TOKEN });
    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("treats a malformed token as an invalid link without asking the database", async () => {
    expect(await claimPlayer(null, buildForm("nope"))).toEqual({ ok: false, error: "not_found" });
    expect(rpc).not.toHaveBeenCalled();
  });

  it.each([
    ["invalid_claim_token", "not_found"],
    ["already_linked", "conflict"],
    ["not_authenticated", "unauthenticated"],
    ["connection reset", "save_failed"],
  ])("maps the database error %s to %s", async (message, expected) => {
    rpc.mockResolvedValue({ data: null, error: { message } });

    expect(await claimPlayer(null, buildForm(VALID_TOKEN))).toEqual({ ok: false, error: expected });
    expect(redirect).not.toHaveBeenCalled();
  });
});
