const fs = require("fs");
const dns = require('node:dns');
const util = require('node:util')

function openFile(filepath) {
  // If the file doesn't exist, then create a new one
  if (!fs.existsSync(filepath)) {
    fs.closeSync(fs.openSync(filepath, "w"));
  }

  // Opening the file
  const file = fs.readFileSync(filepath);

  // If it's empty, then create structure
  if (file.length > 0) {
    return JSON.parse(file);
  } else {
    return {};
  }
}

async function isValidUrl(string) {
  let lookup = util.promisify(dns.lookup);

  try {
    let response = await lookup(string);
    console.log(response);
    return true;
  } catch {
    return false;
  }
}

module.exports = { openFile, isValidUrl };
