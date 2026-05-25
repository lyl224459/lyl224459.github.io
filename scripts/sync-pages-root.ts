import { cp, rm } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = resolve(projectRoot, "dist");
const sourceIndex = resolve(distRoot, "index.html");
const sourceAssets = resolve(distRoot, "assets");
const targetIndex = resolve(projectRoot, "index.html");
const targetAssets = resolve(projectRoot, "assets");

function assertInsideProject(path: string): void {
  const projectRelativePath = relative(projectRoot, path);

  if (projectRelativePath.startsWith("..") || isAbsolute(projectRelativePath)) {
    throw new Error(`Refusing to write outside project root: ${path}`);
  }
}

assertInsideProject(targetIndex);
assertInsideProject(targetAssets);

await cp(sourceIndex, targetIndex);
await rm(targetAssets, { recursive: true, force: true });
await cp(sourceAssets, targetAssets, { recursive: true });

console.log("Synced Vite build output to repository root for branch-based GitHub Pages.");
