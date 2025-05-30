const fs = require("fs");
const axios = require("axios");
const path = require("path");
async function downloadVideo(fileUrl) {
  const outputPath = path.join(__dirname, "../out", "video.mp4");
  const writer = fs.createWriteStream(outputPath);

  const response = await axios({
    method: "get",
    url: fileUrl,
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => {
      console.log(`File downloaded to ${outputPath}`);
      resolve();
    });
    writer.on("error", reject);
  });
}

module.exports = downloadVideo;