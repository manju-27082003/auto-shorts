const path = require("path");
const fs = require("fs");
const { google } = require("googleapis");
const readline = require("readline");
const deleteVideoData = require("./deleteVideoData");
async function uploadVideoToYoutube() {
  const VIDEO_FILE_PATH = path.join(__dirname, "../out", "video.mp4");

  // OAuth2 client setup
  const SCOPES = ["https://www.googleapis.com/auth/youtube.upload"];
  const TOKEN_PATH = path.join(__dirname, "../token.json");

  // Load client secrets from a local file
  fs.readFile("client_secret.json", (err, content) => {
    if (err) return console.error("Error loading client secret file:", err);
    authorize(JSON.parse(content), uploadVideo);
  });

  function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0],
    );

    // Check if we have previously stored a token
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });
    console.log("Authorize this app by visiting this URL:", authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("Enter the code from that page here: ", (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error("Error retrieving access token", err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) console.error(err);
          console.log("Token stored to", TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }

  function uploadVideo(auth) {
    const youtube = google.youtube({ version: "v3", auth });
    youtube.videos.insert(
      {
        part: "snippet,status",
        requestBody: {
          snippet: {
            title: "How Big Is the Universe? Mind-Blowing Space Facts",
            description:
              "🌌 Did you know there are more stars in the universe than grains of sand on Earth ? In this quick space fact video, we explore the wonders of the cosmos.🔭 Inspired by NASA's Astronomy Picture of the Day (APOD).NASA is not affiliated with or endorsing this video.👉 Don't forget to like, comment, and subscribe for more amazing facts!#SpaceFacts #ScienceShorts #Astrophysics.",
            tags: [
              "#shorts",
              "#trending",
              "#viral",
              "#space",
              "#universe",
              "#spacex",
            ],
            categoryId: "28", // People & Blogs
          },
          status: {
            privacyStatus: "public",
          },
        },
        media: {
          body: fs.createReadStream(VIDEO_FILE_PATH),
        },
      },
      (err, res) => {
        if (err) {
          deleteVideoData();
          console.error("Error uploading video:", err);
          return err;
        } else {
          console.log("Video uploaded successfully:", res.data);
          deleteVideoData();
          return res.data;
        }
      },
    );
  }
}

module.exports = uploadVideoToYoutube;
