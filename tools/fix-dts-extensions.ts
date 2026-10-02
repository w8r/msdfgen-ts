/**
 * tools/fix-dts-extensions.ts
 *
 * Post-build step: appends `.js` to extensionless relative imports in the
 * emitted declaration files (`dist/types/**\/*.d.ts`).
 *
 * The source deliberately uses extensionless relative imports (Vite resolves
 * them), and tsc copies those specifiers into the .d.ts output verbatim.
 * Consumers type-checking with `moduleResolution: "node16"/"nodenext"` then
 * fail with TS2834 on every import in our types. `.js` (not `.d.ts`) is the
 * spelling TypeScript resolves to the sibling declaration file under every
 * moduleResolution mode, so the rewritten files work for nodenext and bundler
 * consumers alike.
 *
 * Throws if a specifier doesn't resolve to an emitted .d.ts file, so a future
 * directory import or path typo fails the build instead of shipping broken
 * types.
 *
 * Usage: npx tsx tools/fix-dts-extensions.ts [typesDir]   (default: dist/types)
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";

const typesDir = resolve(process.argv[2] ?? "dist/types");
// `from "./x"`, `import("./x")`, `export * from "../x"` — relative, no extension.
const SPECIFIER = /((?:from\s+|import\()\s*["'])(\.{1,2}\/[^"']*?)(["'])/g;

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith(".d.ts") ? [join(dir, e.name)] : [],
  );
}

let rewritten = 0;
for (const file of walk(typesDir)) {
  const src = readFileSync(file, "utf8");
  const out = src.replace(SPECIFIER, (match, pre: string, spec: string, post: string) => {
    if (/\.[cm]?js$/.test(spec)) return match;
    if (!existsSync(resolve(dirname(file), `${spec}.d.ts`))) {
      throw new Error(`${file}: "${spec}" does not resolve to an emitted .d.ts file`);
    }
    rewritten++;
    return `${pre}${spec}.js${post}`;
  });
  if (out !== src) writeFileSync(file, out);
}
console.log(`fix-dts-extensions: rewrote ${rewritten} relative import(s) in ${typesDir}`);
