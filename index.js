require("dotenv").config()
const path = require("path")
const favicon = require("serve-favicon")
const express = require("express")
const cookieParser = require("cookie-parser")
const app = express()

// const whitelist = ["http://localhost:3000", "https://adventurous-dove-teddy.cyclic.app", "https://pasaratas.cyclic.app"];
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1 || !origin) {
//       callback(null, true); // Allow the request if origin is in whitelist or if it's not defined (e.g., same-origin request)
//     } else {
//       callback(new Error("Not allowed by CORS")); // Block the request if origin is not in whitelist
//     }
//   },
// };

// app.use(cors(corsOptions));

app.use(express.json())

app.use(express.urlencoded({extended: true}))

const options = {
  dotfiles: "ignore",
  etag: false,
  extensions: ["htm", "html", "css", "js", "ico", "jpg", "jpeg", "png", "svg"],
  index: ["index.html"],
  maxAge: "1m",
  redirect: false,
}

app.use(cookieParser())

app.use(express.static("public", options))

app.use(favicon(path.join(__dirname, "public", "./img/ico/favicon.ico")))

app.use("/api", require("./router/api"))

app.use("/auth", require("./router/auth"))

app.use("/upload", require("./router/upload"))

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({status: false, content: "Something went wrong!"})
})

// Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`index.js listening on ${port}`)
})
