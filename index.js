require('dotenv').config()
const path = require("path")
const favicon = require('serve-favicon');
const express = require('express')
const session = require("express-session");
const cors = require("cors");
const app = express()
const { middleWare } = require("./middleware");

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

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 6 * 60 * 60 * 1000, secure: !process.env.SECURE ? true : false
    },
  })
);

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

console.log("Cookie Secure : ", !process.env.SECURE ? true : false);

// #############################################################################
// This configures static hosting for files in /public that have the extensions
// listed in the array.

const options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html', 'css', 'js', 'ico', 'jpg', 'jpeg', 'png', 'svg'],
  index: ['index.html'],
  maxAge: '1m',
  redirect: false
}
app.use(express.static('public', options))
// #############################################################################


app.use(favicon(path.join(__dirname, 'public', './img/ico/favicon.ico')));

app.use(middleWare);

app.use("/api", require("./router/api"));

app.use("/auth", require("./router/auth"));

app.use("/upload", require("./router/upload"));

// Catch all handler for all other request.
app.use('*', (req, res) => {
  res.json({ msg: 'no route handler found' }).end()
})

// Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`index.js listening on ${port}`)
})
