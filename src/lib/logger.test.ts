import { logger } from "./logger";

describe("logger", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("writes one JSON line with the event and context", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => undefined);

    logger.info("result_published", { fixtureId: "f1" });

    const entry = JSON.parse(String(spy.mock.calls[0]?.[0]));
    expect(entry).toMatchObject({ level: "info", event: "result_published", fixtureId: "f1" });
  });

  it("keeps the message and name of errors instead of an empty object", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    logger.error("save_failed", { error: new Error("connection reset") });

    const entry = JSON.parse(String(spy.mock.calls[0]?.[0]));
    expect(entry.error).toMatchObject({ name: "Error", message: "connection reset" });
  });
});
