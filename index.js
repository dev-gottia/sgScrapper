const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");
const Push = require("pushover-notifications");

// Replace these with your actual cookies
const cookies =
  "laravel_session=eyJpdiI6Ik5GTm1CVGhSc0V0Z0Z6RmROWkxxQmc9PSIsInZhbHVlIjoiVmN3Vjlpa2xzbmdUSHlGbGRmblZYaTZBMm9aUlkrNHBnTjQ0aTRjMktRemx3Q1VQRStYWnUwbTFvb0tNMlJnTkNTT2dLQW1sYlYzd2lCYjVPWkNTUDQ3N2ZNUEl4TjhraFRJeXRQNkpZeFBHSFBLVW00SDlUdDlHK3Y1TEd6REIiLCJtYWMiOiI1NzA2YjQ3NmE5NWFjMzlkNTA0MTM4OTFmMmQ0MWM4M2M2N2RhMDljNmJahYTgyYWY4ZTBkYjUxNWUxYmMxNWI4IiwidGFnIjoiIn0%3D;";

// Set up a configuration object with headers, including the "Cookie" header
const config = {
  headers: {
    "Content-Type": "text/html; charset=UTF-8",
    Cookie: cookies,
  },
  responseType: "text", // Set the responseType to 'text' to handle HTML content
};

// Initialize Pushover with your API token and user key
const push = new Push({
  user: "umhjotsjpkp95bggp6fozzfbn4ykz8",
  token: "a2ayyt4i67u7j54dk57g2qzj13d7xo",
});

// Array of URLs and their corresponding messages
const urlsAndMessages = [
  {
    url: "https://streamsgate.net/dashboard",
    message: "SOCCER",
  },
  {
    url: "https://streamsgate.net/dashboard/basketball",
    message: "NBA",
  },
  {
    url: "https://streamsgate.net/dashboard/ice-hockey",
    message: "NHL",
  },
  {
    url: "https://streamsgate.net/dashboard/baseball",
    message: "MLB",
  },
  {
    url: "https://streamsgate.net/dashboard/american-football",
    message: "NFL",
  },
  {
    url: "https://streamsgate.net/dashboard/mma",
    message: "MMA",
  },
  {
    url: "https://streamsgate.net/dashboard/boxing",
    message: "BOXING",
  },
  {
    url: "https://streamsgate.net/dashboard/motorsport",
    message: "F1",
  },
];

// Object to store previous total values for each URL
const previousTotalValues = {};

// Function to make the request and handle the value for a given URL
const checkAndNotify = async ({ url, message }) => {
  try {
    const response = await axios.get(url, config);
    const $ = cheerio.load(response.data);
    const totalValue = $(".total").text();

    // Check if the value has changed
    if (totalValue !== previousTotalValues[url]) {
      // Send a push notification with the custom message and old value
      push.send({
        message: `${message} : ${totalValue} (Old Value: ${previousTotalValues[url]})`,
      });

      // Update the previous value for this URL
      previousTotalValues[url] = totalValue;
    }
  } catch (error) {
    console.error(`Error checking ${url}:`, error.message);
  }
};

urlsAndMessages.forEach(({ url, message }) => {
  cron.schedule("*/3 * * * *", () => checkAndNotify({ url, message }));
});

// Run the initial check for each URL
urlsAndMessages.forEach(checkAndNotify);
