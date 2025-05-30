require("dotenv").config();
const {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");

const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.S3_POLICY_ACCESS_KEY,
    secretAccessKey: process.env.S3_POLICY_SECRET_KEY,
  },
});
const deleteAllExceptOne = async () => {
  try {
    //aws s3 files deletion
    const bucketName = "my-auto-post-assets";
    const objectToKeep = "booktherental.mp3";
    let continuationToken;
    do {       
      // List objects in the bucket
      const listParams = {
        Bucket: bucketName,
        ContinuationToken: continuationToken,
      };
      const listCommand = new ListObjectsV2Command(listParams);
      const listResponse = await s3Client.send(listCommand);

      // Filter out the object to keep
      const objectsToDelete = listResponse.Contents.filter(
        ({ Key }) => Key !== objectToKeep,
      ).map(({ Key }) => ({ Key }));

      if (objectsToDelete.length > 0) {
        // Delete the filtered objects
        const deleteParams = {
          Bucket: bucketName,
          Delete: {
            Objects: objectsToDelete,
          },
        };
        const deleteCommand = new DeleteObjectsCommand(deleteParams);
        await s3Client.send(deleteCommand);
        console.log(`Deleted ${objectsToDelete.length} objects.`);
      }

      continuationToken = listResponse.IsTruncated
        ? listResponse.NextContinuationToken
        : null;
    } while (continuationToken);

    console.log(
      `All objects except '${objectToKeep}' have been deleted from bucket: ${bucketName}`,
    );
  } catch (error) {
    console.error("Error deleting files:", error);
  }
};
async function deleteVideoData() {
  try {
    await deleteAllExceptOne();
    const folderPath = path.join(__dirname, "../public/images");
    const videoPath = path.join(__dirname, "../out/video.mp4");
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
      console.log("Images folder deleted successfully.");
    } else {
      console.log("Images folder does not exist.");
    }
    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath, (err) => {
        if (err) {
          console.error("Error deleting video file:", err);
        } else {
          console.log("Video file deleted successfully");
        }
      });
    }
    
  } catch (error) {
    console.log(error);
  }
}

module.exports = deleteVideoData;
