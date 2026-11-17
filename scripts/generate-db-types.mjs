import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

const projectRef = process.env.SUPABASE_PROJECT_REF ?? "";

// The ref is interpolated into a shell command, so only accept the format Supabase issues.
if (!/^[a-z0-9]{20}$/.test(projectRef)) {
  console.error("SUPABASE_PROJECT_REF in .env.local is missing or not a valid project ref.");
  process.exit(1);
}

const types = execSync(`npx supabase gen types typescript --remote=${projectRef} --schema public`, {
  encoding: "utf8",
});

mkdirSync("src/types", { recursive: true });
writeFileSync("src/types/database.ts", types);
console.log("Wrote src/types/database.ts");
