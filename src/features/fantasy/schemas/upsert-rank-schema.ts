import { FANTASY_PRICE_CEILING, FANTASY_PRICE_FLOOR, FANTASY_PRICE_STEP } from "@/config/fantasy";
import { z } from "zod";

const priceStep = FANTASY_PRICE_STEP;

export const upsertFantasyRankSchema = z.object({
  playerId: z.uuid(),
  price: z.coerce
    .number()
    .min(FANTASY_PRICE_FLOOR)
    .max(FANTASY_PRICE_CEILING)
    .refine((value) => Math.abs(value / priceStep - Math.round(value / priceStep)) < 0.001),
});

export type UpsertFantasyRankInput = z.infer<typeof upsertFantasyRankSchema>;

export function readUpsertRankForm(formData: FormData): unknown {
  return {
    playerId: formData.get("playerId"),
    price: formData.get("price"),
  };
}
