import fs from "fs";
import { pipeline } from "stream";
import zlib from "zlib";

export const compressFile = (sourceFile, destinationFile) => {
  // Create read, compress, and write streams
  const readStream = fs.createReadStream(sourceFile);
  const gzipStream = zlib.createGzip();
  const writeStream = fs.createWriteStream(destinationFile);

  // pipeline automatically handles errors and cleans up streams safely
  pipeline(readStream, gzipStream, writeStream, (err) => {
    if (err) {
      console.error("Compression failed:", err);
    } else {
      console.log("Compression successful! File shrunk drastically.");
    }
  });
};

export const decompressFile = (sourceFile, destinationFile) => {
  // Create read, decompress (Gunzip), and write streams
  const readStream = fs.createReadStream(sourceFile);
  const gunzipStream = zlib.createGunzip();
  const writeStream = fs.createWriteStream(destinationFile);

  // pipeline automatically handles errors and cleans up streams safely
  pipeline(readStream, gunzipStream, writeStream, (err) => {
    if (err) {
      console.error("Decompression failed:", err);
    } else {
      console.log("Decompression successful! File restored to original size.");
    }
  });
};
