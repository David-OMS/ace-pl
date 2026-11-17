import { Constants, type Database } from "@/types/database";

export type FixtureStatus = Database["public"]["Enums"]["fixture_status"];

export const FIXTURE_STATUSES: readonly FixtureStatus[] = Constants.public.Enums.fixture_status;

/** Statuses an admin can pick when creating or editing a fixture by hand. */
export const EDITABLE_FIXTURE_STATUSES = ["draft", "published", "postponed", "void"] as const;
