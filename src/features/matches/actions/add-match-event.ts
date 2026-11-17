"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { MATCH_EVENT_TYPES } from "@/config/match-events";
import { checkAdminAccess } from "@/features/auth";
import { adminFixturePath } from "@/features/fixtures";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";

import { insertMatchEvent } from "./insert-match-event";

export type AddMatchEventState = ActionResult<{ savedAt: number }> | null;

const schema = z.object({
  tournamentId: z.uuid(),
  fixtureId: z.uuid(),
  eventType: z.enum(MATCH_EVENT_TYPES),
  playerId: z.uuid(),
  assistPlayerId: z.string(),
  quantity: z.coerce.number().int().min(1).max(50),
});

function readAssist(eventType: string, raw: string): string | null {
  if (eventType !== "goal" || !z.uuid().safeParse(raw).success) return null;
  return raw;
}

export async function addMatchEvent(
  _previous: AddMatchEventState,
  formData: FormData,
): Promise<AddMatchEventState> {
  const parsed = schema.safeParse({
    tournamentId: formData.get("tournamentId"),
    fixtureId: formData.get("fixtureId"),
    eventType: formData.get("eventType"),
    playerId: formData.get("playerId"),
    assistPlayerId: formData.get("assistPlayerId") ?? "",
    quantity: formData.get("quantity") ?? "1",
  });
  if (!parsed.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const data = parsed.data;
  const { error } = await insertMatchEvent({
    tournamentId: data.tournamentId,
    fixtureId: data.fixtureId,
    eventType: data.eventType,
    playerId: data.playerId,
    assistPlayerId: readAssist(data.eventType, data.assistPlayerId),
    quantity: data.quantity,
  });

  if (error?.code === "23505") return fail("conflict");
  if (error) {
    logger.error("add_match_event_failed", { fixtureId: data.fixtureId, error });
    return fail("save_failed");
  }
  revalidatePath(adminFixturePath(data.tournamentId, data.fixtureId));
  return ok({ savedAt: Date.now() });
}
