import fs from "fs/promises";
import path from "path";
import { existsSync } from "node:fs";
import { listFiles } from "../../utils/listFiles.js";
import {
  readHistoryFile,
  saveCommitHistory,
} from "../../utils/updateHistory.js";
import { getCompressedBuffer } from "../../utils/codecBuffer.js";
import { hashText } from "../../utils/hashing.js";

const commitCode = async (commitDesc) => {
  if (!commitDesc) {
    console.log("No commit message provided!");
    return;
  }
  try {
    const filePaths = await listFiles(process.cwd());
    const commits = readHistoryFile();
    const commitObject = {
      commitId: crypto.randomUUID(),
      commitDesc,
      files: {},
      date: new Date().toString().replace(/ \([^)]+\)$/, ""),
    };

    const listOfFilesInCompressed =
      (await listFiles(path.join(process.cwd(), "./.trail/compressed"))) || [];

    let contentOfTrailIgnore = [];
    if (existsSync(path.join(process.cwd(), ".trailignore"))) {
      const filesToIgnore = await fs.readFile(
        path.join(process.cwd(), ".trailignore"),
        "utf-8",
      );
      const words = filesToIgnore
        .split(/\r?\n/)
        .map((word) => word.trim())
        .filter(Boolean);
      contentOfTrailIgnore = words;
    }

    for (const filePath of filePaths) {
      if (
        filePath === ".trail" ||
        filePath === "node_modules" ||
        contentOfTrailIgnore.includes(filePath)
      )
        continue;
      const fullPath = path.join(process.cwd(), filePath);
      const stat = await fs.stat(fullPath);
      if (stat.isDirectory()) {
        continue;
      }
      const targetDir = path.join(process.cwd(), ".trail/compressed");

      const compressedBuffer = await getCompressedBuffer(fullPath);
      // await fs.mkdir(targetDir, { recursive: true });
      const content = await fs.readFile(fullPath, "utf8");
      const hashedFileName = hashText(content);
      commitObject.files = {
        [filePath]: hashedFileName,
        ...commitObject.files,
      };
      if (!listOfFilesInCompressed.includes(hashedFileName)) {
        const destinationFile = path.join(targetDir, hashedFileName);
        await fs.writeFile(destinationFile, compressedBuffer);
      }
    }
    commits.push(commitObject);
    saveCommitHistory(commits);
    // updateHistory(commitDesc, filePaths);
    console.log("Successfully commited changes");
  } catch (err) {
    console.error("An error occurred:", err);
  }
};

export default commitCode;
