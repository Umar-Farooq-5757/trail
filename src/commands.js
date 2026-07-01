import fs from "fs/promises";
import path, { dirname } from "path";
import { exec } from "child_process";
import { promisify } from "util";

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
export const commitCode = () => {};