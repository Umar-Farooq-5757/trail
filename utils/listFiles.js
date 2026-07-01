import { readdir } from "fs/promises";

export const listFiles = async (directory) => {
  try {
    const files = await readdir(directory);
    // console.log("Files:")
    // console.log(files)
    return files;
  } catch (err) {
    console.error("Error reading directory:", err);
  }
};

// listFiles()
