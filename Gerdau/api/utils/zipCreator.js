// require modules
const fs = require("fs");
const archiver = require("archiver");

export async function createZip(data, zipName) {
  const zipPath = `${zipName}`;
  // create a file to stream archive data to.
  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip", {
    zlib: { level: 9 }, // Sets the compression level.
  });

  // good practice to catch warnings (ie stat failures and other non-blocking errors)
  archive.on("warning", function (err) {
    if (err.code === "ENOENT") {
      // log warning
    } else {
      // throw error
      throw err;
    }
  });

  // good practice to catch this error explicitly
  archive.on("error", function (err) {
    throw err;
  });

  // pipe archive data to the file
  archive.pipe(output);

  // append a file from stream
  let file1;
  for (const file of data) {
    file1 = `${file}`;
    archive.append(fs.createReadStream(file1), { name: `${file}` });
  }

  archive.finalize();
}
