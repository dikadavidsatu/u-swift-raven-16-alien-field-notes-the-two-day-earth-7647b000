// Alien Field Notes: The Two Day Earth Review — entry generator.
// Writes one original alien-tourist review line to entry.txt in the output dir.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "4 stars. Locals queue for hours to watch other locals run in circles, then cry either way. Food excellent, beds face a glowing rectangle. Would abduct again.";

function validate(text: string): void {
  if (typeof text !== "string" || text.length === 0) {
    throw new Error("entry must be non-empty text");
  }
  if (text.length > 200) {
    throw new Error(`entry is ${text.length} characters; gate allows at most 200`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  // The gate reads UTF-8 plain text: reject control characters and confirm
  // the string survives a UTF-8 encode/decode round-trip unchanged.
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    if (code < 0x20 || code === 0x7f) {
      throw new Error("entry must not contain control characters");
    }
  }
  if (Buffer.from(text, "utf8").toString("utf8") !== text) {
    throw new Error("entry is not clean UTF-8 text");
  }
}

validate(ENTRY);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, ENTRY, "utf8");
// Read back what landed on disk and re-validate it, so a bad write can
// never slip a non-conforming file past the gate unnoticed.
validate(readFileSync(target, "utf8"));
console.log(`wrote entry.txt (${ENTRY.length} characters)`);
