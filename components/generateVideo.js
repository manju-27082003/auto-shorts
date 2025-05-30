
const dotenv = require("dotenv");
const {renderMediaOnLambda,getRenderProgress,getFunctions} = require("@remotion/lambda/client");
dotenv.config();
async function generateVideo({ images, captions, audio }) {
  try {
    const functions = await getFunctions({
      region: 'your-region',
      compatibleOnly: true,
    });
     
    const functionName = functions[0].functionName;
    const { renderId, bucketName } = await renderMediaOnLambda({
      region: "your-region',",
      functionName: functionName,
      serveUrl: "my-video",
      composition: "MyVideo",
      deleteAfter: '1-day',
      inputProps: {
        images: images,
        audioSrc: audio,
        captions: captions,
        durationInFrames:
          Math.ceil(captions[captions?.length - 1]?.end / 1000) * 30,
      },
      codec: "h264",
      imageFormat: "png",
      maxRetries: 1,
      framesPerLambda: 100,
      privacy: "public",
    });
    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const progress = await getRenderProgress({
        renderId,
        bucketName,
        functionName: functionName,
        region: "your-region", // replace with your region
      });
      if (progress.done) {
        console.log("Render finished!");
        return progress.outputFile;
        // process.exit(0);
      }
      if (progress.fatalErrorEncountered) {
        console.error("Error enountered", progress.errors);
        process.exit(1);
      }
    }
  } catch (error) {
    console.error("Error generating video:", error);
    return null;
  }
}
module.exports = generateVideo;

// generateVideo();
