require("dotenv").config();
const path = require("path");
const fs = require("fs");
async function refreshAccessToken() {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        refresh_token: process.env.REFRESH_TOKEN,
        grant_type: "refresh_token",
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Update stored tokens and expiry time

      console.log(data);
      const filePath = path.join(__dirname, "../token.json");

      // Write the data to token.json
      fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
          console.error("Error writing token.json:", err);
        } else {
          console.log("Token data saved to token.json");
        }
      });
    } else {
      console.error("Failed to refresh access token:", data);
      // Handle token refresh failure (e.g., prompt user to re-authenticate)
    }
    return response;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    // Handle error (e.g., prompt user to re-authenticate)
  }
}
module.exports = refreshAccessToken;
