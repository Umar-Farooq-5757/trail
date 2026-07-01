import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { getCompressedBuffer } from "../utils/codecBuffer.js";
import { hashText } from "../utils/hashing.js";
import { listFiles } from "../utils/listFiles.js";
import { readHistoryFile, saveCommitHistory } from "../utils/updateHistory.js";

const execPromise = promisify(exec);

export const initialize = async () => {
  const dirName = ".trail";
  const dirPath = path.join(process.cwd(), dirName);

  try {
    await fs.mkdir(dirPath, { recursive: true });
    // console.log(`Directory created at: ${dirPath}`);

    if (process.platform === "win32") {
      await execPromise(`attrib +h "${dirPath}"`);
      // console.log("Directory successfully hidden on Windows.");
    }

    console.log("Repository initialized successfully!");
    await fs.mkdir(path.join(dirPath, "compressed"), { recursive: true });
    await fs.writeFile(path.join(dirPath, "history.json"), "", { flag: "wx" });
  } catch (err) {
    console.error(`Error during initialization: ${err.message}`);
  }
};
export const commitCode = async (commitDesc) => {
  try {
    const filePaths = await listFiles(process.cwd());
    const commits = readHistoryFile();
    const nextId =
      commits.length > 0 ? Math.max(...commits.map((c) => c.commitId)) + 1 : 1;
    const commitObject = { commitId: nextId, commitDesc, files: {} };
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
      // await fs.mkdir(targetDir, { recursive: true });
      const content = await fs.readFile(fullPath, "utf8");
      const listOfFilesInCompressed = await listFiles(
        path.join(process.cwd(), "./.trail/compressed"),
      );
      const hashedFileName = hashText(content);
      commitObject.files = {
        [filePath]: hashedFileName,
        ...commitObject.files,
      };
      // if(!listOfFilesInCompressed.includes(hashedFileName)){
      const destinationFile = path.join(targetDir, hashedFileName);
      await fs.writeFile(destinationFile, compressedBuffer);
      // }
    }
    commits.push(commitObject);
    saveCommitHistory(commits);
    // updateHistory(commitDesc, filePaths);
    console.log("Successfully commited changes");
  } catch (err) {
    console.error("An error occurred:", err);
  }
};
