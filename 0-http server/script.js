const http = require("http");

const options = {
  hostname: "www.google.com",
  port: 80,
  path: "/",
  method: "GET",
};

const req = http.request(options, (res) => {
  let data = "";

  console.log(`Status Code: ${res.statusCode}`);

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log("Response Body:", data.split("style"));
  });
});

req.on("error", (error) => {
  console.error("Error:", error);
});

req.end();
