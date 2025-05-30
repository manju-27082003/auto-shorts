require("dotenv").config();
const fs = require("fs");
const path = require("path");
const fsPromises = require("fs/promises");
const fetch = require("node-fetch");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Utility to wait for delay (in ms)
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to download image with retry logic
async function downloadImage(imageUrl, retries = 10, delayMs = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error(`Fetch failed with status ${response.status}`);
      }

      const buffer = await response.buffer();
      const filename = `image${Date.now()}.png`;
      const folderPath = path.join(__dirname, "../public/images");
      const outputPath = path.join(folderPath, filename);

      if (!fs.existsSync(folderPath)) {
        await fsPromises.mkdir(folderPath, { recursive: true });
      }

      await fsPromises.writeFile(outputPath, buffer);
      const imagePath= path.join(__dirname, "../public/images", filename);
      console.log(`✅ Image downloaded and saved as ${filename}`);
      return imagePath;
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed: ${error.message}`);
      if (attempt < retries) {
        console.log(`🔁 Retrying in ${delayMs}ms...`);
        await delay(delayMs);
      } else {
        throw new Error(
          `❌ All ${retries} attempts failed for URL: ${imageUrl}`,
        );
      }
    }
  }
}
async function uploadToS3(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    const params = {
      Bucket: "your-bucket", // replace with your bucket name
      Key: fileName,
      Body: fileContent,
      ContentType: 'image/png'

    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const fileUrl = `https://your-bucket.s3.eu-north-1.amazonaws.com/${fileName}`;
    console.log(`File uploaded successfully. URL: ${fileUrl}`);
    return fileUrl;
  } catch (error) {
    console.error(`Error uploading to S3: ${error.message}`);
    throw error;
  }
}
async function imgGen(script) {
  try {
    const width = 1080;
    const height = 1920;
    const seed = 42;
    const model = "flux";
    const imgUrls = [];

    for (const item of script) {
      const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(item.imagePrompt)}?width=${width}&height=${height}&seed=${seed}&model=${model}&nologo=true&enhance=true&nofeed=true&safe=true`;
      console.log(`Generated image URL: ${imageUrl}`);
      imgUrls.push(imageUrl);
    }

    const localUrls = [];
    for (const url of imgUrls) {
      const localUrl = await downloadImage(url); // Will retry internally
      if (localUrl) {
        localUrls.push(localUrl);
      }
    }
    const s3Urls = [];
    //push rhe download images to aws s3 bucket
    for (const url of localUrls) {
      const s3Url = await uploadToS3(url); // Will retry internally
      if (s3Url) {
        s3Urls.push(s3Url);
      }
    }
    console.log(s3Urls);
    return s3Urls;
  } catch (error) {
    console.error(`Error in imgGen: ${error.message}`);
    return [];
  }
}

module.exports = imgGen;
