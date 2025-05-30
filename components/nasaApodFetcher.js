const axios = require("axios");

async function nasaApodFetcher() {
  try {
    const res = await axios.get(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`,
    );
    // console.log(res.data.explanation);
    return res.data.explanation;
  } catch (error) {
    throw new Error(`Error fetching NASA APOD data: ${error.message}`);
  }
}

// nasaApodFetcher().then(console.log); // Optional test
module.exports = nasaApodFetcher;
