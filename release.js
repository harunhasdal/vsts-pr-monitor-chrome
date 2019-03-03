const exec = require("child_process").exec;
const execSync = require("child_process").execSync;

const zipName = "pr-monitor-chrome.zip";

const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const EXTENSION_ID = process.env.EXTENSION_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;

execSync(`zip -j ${zipName} public/*`);
console.log(`Zip file created as ${zipName}`);
uploadZip();

function uploadZip() {
  let cmd = getUploadCommand();
  exec(cmd, (error, stdout, stderr) => {
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    if (error !== null) {
      console.log(`Exec error: ${error}`);
    } else {
      console.log("Successfully Uploaded the zip to chrome web store");
      publishExtension(); // on successful upload, call publish
    }
  });
}

function publishExtension() {
  let cmd = getPublishCommand();
  exec(cmd, (error, stdout, stderr) => {
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    if (error !== null) {
      console.log(`Exec error: ${error}`);
    } else {
      console.log("Successfully published the newer version");
    }
  });
}

const commandOptions = `--source ${zipName} --extension-id ${EXTENSION_ID} --client-id ${CLIENT_ID} --client-secret ${CLIENT_SECRET} --refresh-token ${REFRESH_TOKEN}`;

function getUploadCommand() {
  return `./node_modules/.bin/webstore upload ${commandOptions}`;
}

function getPublishCommand() {
  return `./node_modules/.bin/webstore publish ${commandOptions}`;
}
