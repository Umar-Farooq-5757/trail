import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { getCompressedBuffer } from "../utils/codecBuffer.js";
import { hashText } from "../utils/hashing.js";
import { listFiles } from "../utils/listFiles.js";

const execPromise = promisify(exec);

export const initialize = async () => {
  const dirName = ".trail";
  const dirPath = path.join(process.cwd(), dirName);

  try {
    await fs.mkdir(dirPath, { recursive: true });
    console.log(`Directory created at: ${dirPath}`);

    if (process.platform === "win32") {
      await execPromise(`attrib +h "${dirPath}"`);
      console.log("Directory successfully hidden on Windows.");
    }

    console.log("Repository initialized successfully!");
  } catch (err) {
    console.error(`Error during initialization: ${err.message}`);
  }
};
export const commitCode = async () => {
  try {
    const filePaths = await listFiles(process.cwd());
    for (const filePath of filePaths) {
      if (filePath === ".trail" || filePath === "node_modules") continue;
      const fullPath = path.join(process.cwd(), filePath);
      // CHECK if it's a directory before reading it
      const stat = await fs.stat(fullPath);
      if (stat.isDirectory()) {
        continue; // Skip folders for now (or recursively scan them later)
      }
      const targetDir = path.join(process.cwd(), ".trail/compressed");

      const compressedBuffer = await getCompressedBuffer(fullPath);
      await fs.mkdir(targetDir, { recursive: true });
      const content = await fs.readFile(fullPath, "utf8");
      const hashedFileName = hashText(content);
      const destinationFile = path.join(targetDir, hashedFileName);
      await fs.writeFile(destinationFile, compressedBuffer);
    }
    console.log("Successfully commited changes");
  } catch (err) {
    console.error("An error occurred:", err);
  }
};
