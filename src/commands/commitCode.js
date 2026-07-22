import fs from "fs/promises";
import path from "path";
import { existsSync } from "node:fs";
import { readHistoryFile, saveCommitHistory } from "../utils/updateHistory.js";
import { getCompressedBuffer } from "../utils/codecBuffer.js";
import { hashText } from "../utils/hashing.js";
import listFiles from "../utils/listFiles.js";

const flattenFiles = (nodes) => {
  let files = [];
  for (const node of nodes) {
    if (node.type === "file") {
      files.push(node);
    } else if (node.type === "folder" && Array.isArray(node.children)) {
      files = files.concat(flattenFiles(node.children));
    }
  }
  return files;
};

const commitCode = async (commitDesc) => {
  if (!commitDesc) {
    console.log("No commit message provided!");
    return;
  }
  try {
    const commits = readHistoryFile();
    const commitObject = {
      commitId: crypto.randomUUID(),
      commitDesc,
      filesAndFolders: {},
      date: new Date().toString().replace(/ \([^)]+\)$/, ""),
    };

    const targetDir = path.join(process.cwd(), ".trail/compressed");
    await fs.mkdir(targetDir, { recursive: true });

    const rawNodes = await listFiles(process.cwd());
    const filePaths = flattenFiles(rawNodes);
    // console.log(filePaths)

    const existingCompressed = await fs.readdir(targetDir);

    let contentOfTrailIgnore = [];
    const ignoreFilePath = path.join(process.cwd(), ".trailignore");
    if (existsSync(ignoreFilePath)) {
      const filesToIgnore = await fs.readFile(ignoreFilePath, "utf-8");
      contentOfTrailIgnore = filesToIgnore
        .split(/\r?\n/)
        .map((word) => path.basename(word.trim()))
        .filter(Boolean);
    }

    for (const filePath of filePaths) {
      if (
        filePath.name === ".trail" ||
        filePath.name === "node_modules" ||
        contentOfTrailIgnore.includes(filePath.name)
      ) {
        continue;
      }

      const fullPath = path.isAbsolute(filePath.path)
        ? filePath.path
        : path.join(process.cwd(), filePath.path);
        // console.log(fullPath)

      const compressedBuffer = await getCompressedBuffer(fullPath);
      const content = await fs.readFile(fullPath, "utf8");
      const hashedFileName = hashText(content);

      commitObject.filesAndFolders = {
        [filePath.path]: hashedFileName,
        ...commitObject.filesAndFolders,
      };

      if (!existingCompressed.includes(hashedFileName)) {
        const destinationFile = path.join(targetDir, hashedFileName);
        await fs.writeFile(destinationFile, compressedBuffer);
      }
    }

    commits.push(commitObject);
    saveCommitHistory(commits);
    console.log("Successfully committed changes");
  } catch (err) {
    console.error("An error occurred:", err);
  }
};

export default commitCode;
