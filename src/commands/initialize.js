import fs, { stat } from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

const initialize = async () => {
  const dirName = ".trail";
  const dirPath = path.join(process.cwd(), dirName);

  async function checkRepositoryInitialized() {
    try {
      const stats = await stat(path.join(process.cwd(), dirName));
      return stats.isDirectory();
    } catch (error) {
      // If the error code is ENOENT, the folder/file does not exist
      if (error.code === "ENOENT") {
        return false;
      }
      // Re-throw other unexpected errors (like permission issues)
      throw error;
    }
  }

  try {
    const repositoryInitialized = await checkRepositoryInitialized();
    if (repositoryInitialized) {
      console.log("Trail repository already initialized");
      return;
    }
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

export default initialize;
