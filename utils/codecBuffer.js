import fs from "fs";
import zlib from "zlib";
import path from "path";

export const getCompressedBuffer = (sourceFile) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const readStream = fs.createReadStream(sourceFile);
    const gzipStream = zlib.createGzip();

    // Pipe the file chunks through the compressor
    readStream.pipe(gzipStream);

    // Collect the compressed chunks into an array
    gzipStream.on("data", (chunk) => chunks.push(chunk));

    // When compression is done, combine chunks into one final buffer
    gzipStream.on("end", () => resolve(Buffer.concat(chunks)));

    // Handle any errors from either stream
    readStream.on("error", reject);
    gzipStream.on("error", reject);
  });
};
