import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import {
  getCompressedBuffer,
  getDecompressedBuffer,
} from "../utils/codecBuffer.js";
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
    for (const filePath of filePaths) {
      if (filePath === ".trail" || filePath === "node_modules") continue;
      const fullPath = path.join(process.cwd(), filePath);
      const stat = await fs.stat(fullPath);
      if (stat.isDirectory()) {
        continue;
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

export const logCommits = (oneline) => {
  const commits = readHistoryFile();
  if (commits.length === 0) {
    console.log("No commits found. Type `trail commit` to create one!");
    return;
  }
  commits.forEach((c) => {
    if (oneline) {
      console.log(c.commitDesc);
      console.log("");
    } else {
      console.log("Commit ID: ", c.commitId);
      console.log("Commit Description: ", c.commitDesc);
      console.log("");
    }
  });
};

export const revertBack = async (commitId) => {
  try {
    const commits = readHistoryFile();
    const commitIDs = commits.map((commit) => commit.commitId);
    if (!commitIDs.includes(commitId)) {
      console.log(`Commit with id: ${commitId} does not exist`);
      return;
    }
    const currentFilesInProject = await listFiles(process.cwd());
    const listOfFilesInCompressed = await listFiles(
      path.join(process.cwd(), "./.trail/compressed"),
    );
    const specificCommitObject = commits.filter(
      (c) => c.commitId == commitId,
    )[0];
    const filesInThatCommitId = specificCommitObject.files;

    for (const [key, value] of Object.entries(filesInThatCommitId)) {
      const content = await getDecompressedBuffer(
        path.join(process.cwd(), ".trail/compressed", value),
      );
      if (currentFilesInProject.includes(key)) {
        const currentContent = await fs.readFile(path.join(process.cwd(),key),'utf-8')
        const hashed = hashText(currentContent)
        // update the file only if its content is changed.
        if (hashed != value) {
          await fs.writeFile(path.join(process.cwd(), key), content);
        }
      } else {
        await fs.writeFile(path.join(process.cwd(), key), content);
      }
    }
  } catch (err) {
    console.log(`Error during reverting: ${err.message}`);
  }
};
