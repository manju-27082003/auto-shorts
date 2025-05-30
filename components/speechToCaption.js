// import axios from "axios";
// import fs from "fs-extra";
require("dotenv").config();
const axios = require("axios");
const fs = require("fs-extra");
const baseUrl = "https://api.assemblyai.com";

const headers = {
  authorization: process.env.ASSEMBLYAI_API_KEY,
};
async function generateCaption() {
  try {
    // You can upload a local file using the following code
    const path = "public/audio/audio.mp3";
    const audioData = await fs.readFile(path);
    const uploadResponse = await axios.post(`${baseUrl}/v2/upload`, audioData, {
      headers,
    });
    const audioUrl = uploadResponse.data.upload_url;

    // const audioUrl = "https://assembly.ai/wildfires.mp3";

    const data = {
      audio_url: audioUrl,
      speech_model: "universal",
    };

    const url = `${baseUrl}/v2/transcript`;
    const response = await axios.post(url, data, { headers: headers });

    const transcriptId = response.data.id;
    const pollingEndpoint = `${baseUrl}/v2/transcript/${transcriptId}`;

    while (true) {
      const pollingResponse = await axios.get(pollingEndpoint, {
        headers: headers,
      });
      const transcriptionResult = pollingResponse.data;

      if (transcriptionResult.status === "completed") {
        // console.log(transcriptionResult.words);
        return transcriptionResult.words;
        break;
      } else if (transcriptionResult.status === "error") {
        throw new Error(`Transcription failed: ${transcriptionResult.error}`);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  } catch (error) {
    console.error("Error generating audio:", error);
  }
}

module.exports = generateCaption;
