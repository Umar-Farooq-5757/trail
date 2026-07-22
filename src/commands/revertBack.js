import fs from "fs/promises";
import path from "path";
import { hashText } from "../utils/hashing.js";
import listFiles from "../utils/listFiles.js";
import { readHistoryFile } from "../utils/updateHistory.js";
import { getDecompressedBuffer } from "../utils/codecBuffer.js";
import chalk from "chalk";

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

const revertBack = async (commitId) => {
  try {
    const commits = readHistoryFile();
    const commitIDs = commits.map((commit) => commit.commitId);
    if (!commitIDs.includes(commitId)) {
      console.log(`Commit with id: ${commitId} does not exist`);
      return;
    }
    const rawNodes = await listFiles(process.cwd());
    const currentFilesInProject = flattenFiles(rawNodes);
    const flattenCurrentFilesInProject = currentFilesInProject.map(
      (file) => file.path,
    );
    // const listOfFilesInCompressed = await listFiles(
    //   path.join(process.cwd(), "./.trail/compressed"),
    // );
    const specificCommitObject = commits.filter(
      (c) => c.commitId == commitId,
    )[0];
    const filesInThatCommitId = specificCommitObject.filesAndFolders;

    for (const [key, value] of Object.entries(filesInThatCommitId)) {
      const content = await getDecompressedBuffer(
        path.join(process.cwd(), ".trail/compressed", value),
      );
      if (flattenCurrentFilesInProject.includes(key)) {
        const currentContent = await fs.readFile(key, "utf-8");
        const hashed = hashText(currentContent);
        // update the file only if its content is changed.
        if (hashed != value) {
          await fs.writeFile(key, content);
        }
      } else {
        // if user runs trail commit and there is a file that isn't in the commit history,
        // trail will ask user if they want to keep that file or not.
        // const yesOrNo = await inquirer.prompt([
        //   {
        //     type: "confirm",
        //     name: "confirmKeep",
        //     message:
        //       "There are some files in your current state of project that are not in the commit you are jumping to. Do you want to keep those files?",
        //     default: true,
        //   },
        // ]);
        // // if(yesOrNo.confirmKeep){
        // console.log(yesOrNo.confirmKeep);
        // // }
        await fs.writeFile(key, content);
      }
    }
    console.log(`Successfully reverted back to Commid ID: ${chalk.bold.cyan(commitId)}`)
  } catch (err) {
    console.log(`Error during reverting: ${err.message}`);
  }
};

export default revertBack;
