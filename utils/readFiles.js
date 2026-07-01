import fs from "fs/promises";
import path from "path";
import { listFiles } from "./listFiles.js";

export const readFiles = async () => {
  try {
    const filePaths = await listFiles(process.cwd());

    for (const filePath of filePaths) {
      const fullPath = path.join(process.cwd(), filePath);

      const content = await fs.readFile(fullPath, "utf8");
      console.log(`--- Content of ${filePath} ---`);
      console.log(content);
    }
  } catch (err) {
    console.error("An error occurred:", err);
  }
};

readFiles();
