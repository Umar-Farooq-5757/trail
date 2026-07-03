import fs from "fs";
import zlib from "zlib";

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

export const getDecompressedBuffer = (sourceFile) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const readStream = fs.createReadStream(sourceFile);
    const gunzipStream = zlib.createGunzip(); // Used Gunzip instead of Gzip

    // Pipe the compressed file chunks through the decompressor
    readStream.pipe(gunzipStream);

    // Collect the decompressed chunks into an array
    gunzipStream.on("data", (chunk) => chunks.push(chunk));

    // When decompression is done, combine chunks into one final buffer
    gunzipStream.on("end", () => resolve(Buffer.concat(chunks)));

    // Handle any errors from either stream
    readStream.on("error", reject);
    gunzipStream.on("error", reject);
  });
};
