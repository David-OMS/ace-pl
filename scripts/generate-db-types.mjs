import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

const projectRef = process.env.SUPABASE_PROJECT_REF;
if (!projectRef) {
  console.error("SUPABASE_PROJECT_REF is missing from .env.local");
  process.exit(1);
}

const types = execFileSync(
  "npx",
  ["supabase", "gen", "types", "typescript", "--project-id", projectRef, "--schema", "public"],
  { encoding: "utf8", shell: process.platform === "win32" },
);

mkdirSync("src/types", { recursive: true });
writeFileSync("src/types/database.ts", types);
console.log("Wrote src/types/database.ts");
