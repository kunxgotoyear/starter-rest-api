const {doc} = require("../auth/google")
const {sheets, getId} = require("../converter/tab")
const bcrypt = require("bcrypt")

exports.middleWare = async (req, res, next) => {
  if (req?.cookies?.sid && req?.cookies?.auth) {
    const verified = await bcrypt.compare(req?.cookies?.sid, req?.cookies?.auth)
    switch (verified) {
      case true:
        if (req._parsedUrl.pathname.includes("login") || req._parsedUrl.pathname.includes("register")) {
          res.status(400).json({status: false, content: "Already logged in!"}).end()
        } else if (req._parsedUrl.pathname.includes("status")) {
          next()
        } else if (req._parsedUrl.pathname.includes("logout")) {
          next()
        } else {
          await doc.loadInfo()
          const docUsers = doc.sheetsByTitle["users"]
          const rows = await sheets(docUsers)
          if (rows.status === false) throw rows
          const status = await rows.status(req?.cookies?.uid)
          createLog(req).catch((error) => {
            console.log(error)
          })
          if (req?._parsedUrl?.pathname) {
            if (req?._parsedUrl?.pathname.includes("users")) {
              if (status === "isAdmin") return next()
              return res.status(400).json({status: false, content: "Access denied!"}).end()
            } else if (req?._parsedUrl?.pathname.includes("status")) {
              return next()
            } else {
              if (status === "isStaff" || status === "isAdmin") return next()
              return res.status(400).json({status: false, content: "Access denied!"}).end()
            }
          } else {
            return res.status(400).json({status: false, content: "Access denied!"}).end()
          }
        }
        break

      default:
        if (req?._parsedUrl?.pathname) {
          if (req._parsedUrl.pathname.includes("login") || req._parsedUrl.pathname.includes("register") || req._parsedUrl.pathname.includes("status")) {
            return next()
          } else {
            res.status(400).json({status: false, content: "Login or Register first!"}).end()
          }
        } else {
          return next()
        }
        break
    }
  } else {
    next()
  }
}

async function createLog(req) {
  const methods = req?.route?.methods ? Object.getOwnPropertyNames(req?.route?.methods)[0].toLowerCase() : req?.method.toLowerCase()
  await doc.loadInfo()
  const log = doc.sheetsByTitle["logs"]
  const rows = await sheets(log)
  switch (methods) {
    case "post":
      await rows.push("LOG-" + getId("1234567890", 8), {
        uid: req?.cookies?.sid,
        method: methods,
        col_id: req?.params?.id,
        col_name: req?.params?.col,
      })
      break
    case "put":
      await rows.push("LOG-" + getId("1234567890", 8), {
        uid: req?.cookies?.sid,
        method: methods,
        col_id: req?.params?.id,
        col_name: req?.params?.col,
      })
      break
    case "delete":
      await rows.push("LOG-" + getId("1234567890", 8), {
        uid: req?.cookies?.sid,
        method: methods,
        col_id: req?.params?.id,
        col_name: req?.params?.col,
      })
      break
    case "get":
      await rows.push("LOG-" + getId("1234567890", 8), {
        uid: req?.cookies?.sid,
        method: methods,
        col_id: req?.params?.id,
        col_name: req?.params?.col,
      })
      break
  }
}

exports.createSID = async (res) => {
  res.cookie("sid", getId("123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM", 144), {
    maxAge: 6 * 60 * 60 * 1000,
    path: "/",
    httpOnly: true,
    secure: !process.env.SECURE ? true : false,
  })
}

exports.createAUTH = async (res, generate, result) => {
  res.cookie("auth", generate, {
    maxAge: 6 * 60 * 60 * 1000,
    path: "/",
    httpOnly: true,
    secure: !process.env.SECURE ? true : false,
  })
  res.cookie("uid", result.content.id, {
    maxAge: 6 * 60 * 60 * 1000,
    path: "/",
    httpOnly: true,
    secure: !process.env.SECURE ? true : false,
  })
}
