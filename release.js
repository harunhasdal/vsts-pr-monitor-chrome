const execSync = require("child_process").execSync;
const fs = require("fs");

const zipName = "pr-monitor-chrome.zip";

execSync(`zip -j ${zipName} public/*`);
console.log(`Successfully created ${zipName}`);

const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const EXTENSION_ID = process.env.EXTENSION_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;
const webStore = require("chrome-webstore-upload")({
  extensionId: EXTENSION_ID,
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  refreshToken: REFRESH_TOKEN
});

const extensionSource = fs.createReadStream(`./${zipName}`);
webStore
  .uploadExisting(extensionSource)
  .then(res => {
    console.log("Successfully uploaded the ZIP");

    webStore
      .publish()
      .then(res => {
        console.log("Successfully published the newer version");
      })
      .catch(error => {
        console.log(`Error while publishing uploaded extension: ${error}`);
        process.exit(1);
      });
  })
  .catch(error => {
    console.log(`Error while uploading ZIP: ${error}`);
    process.exit(1);
  });
