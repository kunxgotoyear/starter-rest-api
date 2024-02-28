const {Router} = require("express")
const router = Router()
const {doc, serviceAccountAuth, drive} = require("../auth/google")
const {sheets, getDataForPage, getId} = require("../converter/tab")
const multer = require("multer")
const upload = multer().single("file")

router.get("/", async (req, res) => {
  res.json({status: true}).end()
})

router.get("/:file", async (req, res) => {
  res.json({status: true}).end()
})

router.post("/", upload, (req, res) => {
  const file = req.file
  if (!file) {
    return res.status(400).send("No file uploaded.")
  }

  const fileMetadata = {
    name: file.originalname,
    parents: ["11UdII1AJliQz5PtlZawC_pCMhyE2bKaQ"],
  }

  const media = {
    mimeType: file.mimetype,
    body: file.stream, // Use the buffer directly
  }

  // Upload file to Google Drive
  drive.files
    .create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    })
    .then((response) => {
      console.log("File uploaded successfully:", response.data)
      res.send("File uploaded successfully")
    })
    .catch((error) => {
      console.error("Error uploading file to Google Drive:", error)
      res.status(500).send("Error uploading file to Google Drive")
    })
})

router.delete("/:file", async (req, res) => {
  res.json({status: true}).end()
})

module.exports = router
