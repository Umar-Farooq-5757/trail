import { createHash } from "crypto";

export const hashText = (text) => {
  return createHash("sha256").update(text).digest("hex");
};
