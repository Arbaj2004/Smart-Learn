require("dotenv").config();
const { Dropbox } = require("dropbox");
const fetch = require("isomorphic-fetch");

const dbx = new Dropbox({
  accessToken: process.env.ACCESS_TOKEN,
  fetch,
});

if (!process.env.ACCESS_TOKEN) {
  console.error("🚨 Dropbox Access Token is missing! Check your .env file.");
}

// ✅ Function to Upload a File and Get a Shared Link
async function uploadFile(file) {
  try {
    if (!file) throw new Error("No file provided!");

    console.log("📤 Uploading file:", file.originalname);

    // 1️⃣ Upload the file to Dropbox
    const uploadResponse = await dbx.filesUpload({
      path: `/${file.originalname}`,
      mode: { ".tag": "overwrite" }, // Ensures file updates instead of conflict
      contents: file.buffer,
    });

    console.log("✅ File uploaded successfully:", uploadResponse.result);

    // 2️⃣ Check if a shared link already exists
    const existingLinks = await dbx.sharingListSharedLinks({
      path: `/${file.originalname}`,
    });

    if (existingLinks.result.links.length > 0) {
      console.log("🔗 Shared link already exists:", existingLinks.result.links[0].url);
      return {
        uploadedFile: uploadResponse.result,
        sharedLink: existingLinks.result.links[0].url,
      };
    }

    // 3️⃣ Generate a new shared link if none exists
    const sharedLinkResponse = await dbx.sharingCreateSharedLinkWithSettings({
      path: `/${file.originalname}`,
    });

    console.log("✅ Shared link created:", sharedLinkResponse.result.url);

    return {
      uploadedFile: uploadResponse.result,
      sharedLink: sharedLinkResponse.result.url,
    };
  } catch (error) {
    console.error("🚨 Error uploading file:", error.error || error.message);
  }
}

module.exports = { uploadFile };
