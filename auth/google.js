const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");
const { google } = require("googleapis");

// Service Account Auth
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
  ],
});

// Drive
const drive = google.drive({
  version: "v3",
  auth: serviceAccountAuth,
});

// Doc
const doc = new GoogleSpreadsheet(
  process.env.GOOGLE_SPREADSHEET_ID,
  serviceAccountAuth
);

module.exports = { serviceAccountAuth, drive, doc };
