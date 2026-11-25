import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

function gateCheck(text: string): void {
  // Gate: UTF-8 text, 1-159 characters, single line, not only whitespace.
  if (!text || text.trim().length === 0) {
    console.error("entry.txt must not be empty or only whitespace");
    process.exit(1);
  }
  if (text.length < 1 || text.length > 159) {
    console.error(`entry.txt must be 1-159 characters, got ${text.length}`);
    process.exit(1);
  }
  if (text.includes("\n") || text.includes("\r")) {
    console.error("entry.txt must be a single line");
    process.exit(1);
  }
}

const text = readFileSync(join(here, "entry.txt"), "utf8");
gateCheck(text);
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output/entry.txt";
const outPath = outDir.endsWith("entry.txt") ? outDir : join(outDir, "entry.txt");
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, text, "utf8");
const back = readFileSync(outPath, "utf8");
if (back !== text) {
  console.error("output mismatch");
  process.exit(1);
}
console.log(`wrote ${text.length} chars to ${outPath}`);
