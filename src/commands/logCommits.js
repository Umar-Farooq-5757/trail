import { readHistoryFile } from "../../utils/updateHistory.js";
import chalk from "chalk";

const logCommits = (oneline) => {
  const commits = readHistoryFile();
  if (commits.length === 0) {
    console.log("No commits found. Type `trail commit` to create one!");
    return;
  }
  commits.forEach((c) => {
    if (oneline) {
      console.log(`${chalk.yellow(c.commitId)} ${c.commitDesc}`);
      console.log("");
    } else {
      console.log(chalk.yellow("Commit ID: "), c.commitId);
      console.log(chalk.blue("Commit Description: "), c.commitDesc);
      console.log("Date: ", c.date);
      console.log("");
    }
  });
};

export default logCommits;
