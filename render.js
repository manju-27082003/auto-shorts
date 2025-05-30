// render.js main file
require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const generate = require("./components/scriptGenerator.js");
const imgGen = require("./components/imageGen.js");
const generateAudio = require("./components/scriptToVoice.js");
const generateCaption = require("./components/speechToCaption.js");
const generateVideo = require("./components/generateVideo.js");
const uploadVideoToYoutube = require("./components/uploadVideo.js");
const deleteVideoData = require("./components/deleteVideoData.js");
const refreshAccessToken = require("./components/refreshAccessToken.js");
const cors = require("cors");
const nasaApodFetcher = require("./components/nasaApodFetcher.js");
const emailSender = require("./components/emailSender.js");
const downloadVideo = require("./components/downloadVideo.js");
app.use(
  cors({
    origin: "*", // Allow all origins
  }),
);

app.use(express.json());
// generate acess token using the refresh token

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages", "home.html"));
});
app.get("/privacy", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages", "privacy.html"));
});
app.get("/terms", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages", "terms.html"));
});

//function for giving random voice models
const getRandomVoiceModel = () => {
  const voiceModels = ["Matthew", "Justin", "Kimberly", "Salli", "Joanna"];
  const randomIndex = Math.floor(Math.random() * voiceModels.length);
  return voiceModels[randomIndex];
};
app.get("/generate", async (req, res) => {
  try {
    const response = await refreshAccessToken();
    if (response) {
      console.log("Access token refreshed successfully");
      const apodData = await nasaApodFetcher();
      console.log(apodData);
      const script = await generate(apodData);
      if (script) {
        console.log(script);
        const imgs = await imgGen(script);
        if (imgs.length == script.length) {
          // setTimeout(async () => {
          const audio = await generateAudio({
            script: script,
            voice: getRandomVoiceModel(),
          });

          if (audio) {
            // setTimeout(async() => {
            console.log(audio);
            console.log("Audio generated successfully");
            const captionsResponse = await generateCaption();
            if (captionsResponse) {
              console.log(captionsResponse);
              const videoResponse = await generateVideo({
                images: imgs,
                audioSrc: audio,
                captions: captionsResponse,
              });
              if (videoResponse) {
                console.log("Video generated successfully", videoResponse);
                await downloadVideo(videoResponse)
                  .then(async () => {
                    console.log("Video downloaded successfully");
                    await uploadVideoToYoutube();
                  })
                  .catch((error) => {
                    console.error("Error downloading video:", error);
                  });
              } else {
                console.log("Video generation failed");
                await emailSender("Video generation failed");

                await deleteVideoData();
              }
            } else {
              console.log("Caption generation failed");
              console.log(captionsResponse);
              await emailSender("Caption generation failed");
              await deleteVideoData();
            }
            // },5000)
          } else {
            console.log("Audio generation failed");
            console.log(response);
            await emailSender("Audio generation failed");
            await deleteVideoData();
          }
          // }, 5000);
        } else {
          console.log("Image generation failed");
          await emailSender("Image generation failed");

          await deleteVideoData();
          res.status(500).json({ message: "Image generation failed" });
        }
        res.status(200).json({ message: "Script generated successfully" });
      } else {
        await emailSender("Script generation failed");

        res.status(500).json({ message: "Script generation failed" });
      }
    } else {
      await emailSender("Access token refresh failed");

      res.status(500).json({ message: "Access token refresh failed" });
    }
  } catch (error) {
    console.error("Error generating video:", error);

    await emailSender(error);
    res.status(500).json({ message: "Error generating video" });
  }
});
// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
