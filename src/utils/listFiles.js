import { readdir } from "fs/promises";
import path from "path";

const DEFAULT_IGNORED = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  ".ds_store",
  "coverage",
]);

const listFiles = async (directory, customIgnored = []) => {
  const ignored = new Set([...DEFAULT_IGNORED, ...customIgnored]);

  const scan = async (currentDir) => {
    try {
      const entries = await readdir(currentDir, { withFileTypes: true });

      const result = await Promise.all(
        entries
          .filter(
            (entry) => !ignored.has(entry.name) && !entry.name.startsWith("."),
          )
          .map(async (entry) => {
            const fullPath = path.join(currentDir, entry.name);

            if (entry.isDirectory()) {
              return {
                name: entry.name,
                type: "folder",
                path: fullPath,
                children: await scan(fullPath),
              };
            }
            return {
              name: entry.name,
              type: "file",
              path: fullPath,
            };
          }),
      );
      return result;
    } catch (err) {
      console.error(`Error reading directory ${currentDir}:`, err);
      return [];
    }
  };

  return scan(directory);
};
export default listFiles;