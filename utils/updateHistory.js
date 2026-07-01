import fs from "fs";
import path from "path";

const HISTORY_FILE_PATH = path.join(process.cwd(), "./.trail/history.json");

export const readHistoryFile = () => {
  if (!fs.existsSync(HISTORY_FILE_PATH)) {
    return [];
  }
  const data = fs.readFileSync(HISTORY_FILE_PATH, "utf-8");
  return JSON.parse(data || "[]");
};

export const saveCommitHistory = (commits) => {
  fs.writeFileSync(HISTORY_FILE_PATH, JSON.stringify(commits, null, 2));
};