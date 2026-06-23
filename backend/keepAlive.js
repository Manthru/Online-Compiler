const https = require("https");

const keepAlive = () => {
  const url = "https://algou-backend.onrender.com";

  setInterval(
    () => {
      https
        .get(url, (res) => {
          console.log(`Keep alive: ${res.statusCode}`);
        })
        .on("error", (e) => {
          console.log("Keep alive error:", e.message);
        });
    },
    14 * 60 * 1000,
  ); // ping every 14 minutes
};

module.exports = keepAlive;
