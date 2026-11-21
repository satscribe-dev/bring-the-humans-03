// bring-the-humans-03 entrypoint.
//
// Copies VIDEO.json from this repository into the output directory.
// That is all it does: the house reads the TikTok video itself from the
// address VIDEO.json names, so nothing this program writes about the
// video counts. No network, no clock, no files outside the repository;
// two runs on the same repository write the same bytes.
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? ".";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const source = join(botDir, "VIDEO.json");

// Fail loudly on a malformed VIDEO.json instead of silently copying
// garbage the gate would refuse: it must be a JSON object naming a
// TikTok video address.
const parsed: unknown = JSON.parse(readFileSync(source, "utf8"));
if (
  typeof parsed !== "object" ||
  parsed === null ||
  typeof (parsed as { url?: unknown }).url !== "string" ||
  !(parsed as { url: string }).url.startsWith("https://") ||
  !(parsed as { url: string }).url.includes("tiktok.com/")
) {
  throw new Error("VIDEO.json must be a JSON object with a TikTok video url");
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(source, join(outputDir, "VIDEO.json"));
