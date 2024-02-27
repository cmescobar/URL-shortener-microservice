require("dotenv").config();
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const utils = require("./utils.js")
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});


app.post("/api/shorturl", async function (req, res) {
  // Filepath definition
  const filepath = "./public/urls.json";
  // Open the url file
  const urlsJSON = utils.openFile(filepath);

  // Get the original URL
  let originalURL = req.body.url;

  // Transform into URL class to get the hostname
  let urlObject = new URL(originalURL);
  
  // Check if the URL is ok
  urlIsValid = await utils.isValidUrl(urlObject.hostname);
  if (!urlIsValid){
    res.json({'error': 'invalid url'});
    return;
  }
  
  // Check if the url is not in the database
  if (urlsJSON.hasOwnProperty(originalURL)) {
    let output = {
      original_url: originalURL,
      short_url: urlsJSON[originalURL],
    };
    res.json(output);
    return;
  }

  // Add a numerated index
  let output = {
    original_url: originalURL,
    short_url: Object.keys(urlsJSON).length,
  };
  urlsJSON[originalURL] = Object.keys(urlsJSON).length;
  console.log(urlsJSON);

  // Saving the url file
  fs.writeFileSync(filepath, JSON.stringify(urlsJSON));

  // Send the response
  res.json(output);
});

app.get("/api/shorturl/:short_url", function (req, res) {
  // Filepath definition
  const filepath = "./public/urls.json";
  // Open the url file
  const urlsJSON = utils.openFile(filepath);

  // Get the shorturl
  const shortUrl = req.params.short_url;

  // Look for the shorturl in the file
  for (let key in urlsJSON){
    if (urlsJSON[key] == shortUrl){
      res.redirect(key);
      return;
    }
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
