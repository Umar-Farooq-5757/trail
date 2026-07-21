import fs from "fs/promises";
import path from "path";
import { getDecompressedBuffer } from "../../utils/codecBuffer.js";
import { hashText } from "../../utils/hashing.js";
import { listFiles } from "../../utils/listFiles.js";
import { readHistoryFile } from "../../utils/updateHistory.js";

const revertBack = async (commitId) => {
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
        const currentContent = await fs.readFile(
          path.join(process.cwd(), key),
          "utf-8",
        );
        const hashed = hashText(currentContent);
        // update the file only if its content is changed.
        if (hashed != value) {
          await fs.writeFile(path.join(process.cwd(), key), content);
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
        await fs.writeFile(path.join(process.cwd(), key), content);
      }
    }
  } catch (err) {
    console.log(`Error during reverting: ${err.message}`);
  }
};

export default revertBack;
