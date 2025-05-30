require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: "your-region",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
async function uploadToS3(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    const params = {
      Bucket: "your-bucket-name", // Replace with your S3 bucket name
      Key: fileName,
      Body: fileContent,
      ContentType: 'audio/mpeg'

    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const fileUrl = `https://your-bucket-name.s3.your-region.amazonaws.com/${fileName}`;
    console.log(`File uploaded successfully. URL: ${fileUrl}`);
    return fileUrl;
  } catch (error) {
    console.error(`Error uploading to S3: ${error.message}`);
    throw error;
  }
}

const {
  PollyClient,
  SynthesizeSpeechCommand,
} = require("@aws-sdk/client-polly");

const client = new PollyClient({
  region: "us-east-1", // Replace with your desired AWS region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Replace with your AWS Access Key ID
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Replace with your AWS Secret Access Key
  },
});


async function generateAudio({ script, voice }) {
  try {
    // Concatenate all contentText into a single string
    const text = script.map(item => item.contentText).join(' ');

    console.log('Text to synthesize:', text);

    const params = {
      Text: text,
      OutputFormat: 'mp3',
      VoiceId: voice,
      // Engine: 'neural', // Uncomment if using neural engine
    };

    const command = new SynthesizeSpeechCommand(params);
    const data = await client.send(command);

    const folderPath = path.join('public', 'audio');
    const outputPath = path.join(folderPath, 'audio.mp3');

    // Ensure the directory exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Write the audio stream to a file
    const writableStream = fs.createWriteStream(outputPath);
    data.AudioStream.pipe(writableStream);

    // Return a promise that resolves when the file is fully written
    await new Promise((resolve, reject) => {
      writableStream.on('finish', resolve);
      writableStream.on('error', reject);
    });

    console.log('Audio file saved to', outputPath);

    // Upload the file to S3
    const s3Url = await uploadToS3(outputPath);
    if (s3Url) {
      // console.log('Audio file uploaded to S3:', s3Url);
      return s3Url;
    } else {
      throw new Error('Error uploading audio file to S3');
    }
  } catch (error) {
    console.error('Error in generateAudio function:', error);
    throw error;
  }
}
// Example usage
// generateAudio();
module.exports = generateAudio;
