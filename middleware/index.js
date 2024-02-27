const { doc } = require("../auth/google");
const { sheets, getId } = require("../converter/tab");

exports.middleWare = async (req, res, next) => {
  if (req) {
    switch (req?.session?.isLoggedIn) {
      case true:
        if (req._parsedUrl.pathname.includes("login") || req._parsedUrl.pathname.includes("register")) {
          res.status(400).json({ status: false, content: "Already logged in!" }).end();
        } else if (req._parsedUrl.pathname.includes("logout")) {
          next();
        } else {
          await doc.loadInfo();
          const docUsers = doc.sheetsByTitle["users"];
          const rows = await sheets(docUsers);
          if (rows.status === false) throw rows;
          const status = await rows.status(req?.session?.uid);
          createLog(req).catch((error) => {
            console.log(error);
          });
          if (req?.params?.col) {
            if (req?.params?.col === "users") {
              if (status === "isAdmin") return next();
              return res.status(400).json({ status: false, content: "Access denied!" }).end();
            } else if (req?.params?.col === "status") {
              return next()
            } else {
              if (status === "isStaff" || status === "isAdmin") return next();
              return res.status(400).json({ status: false, content: "Access denied!" }).end();
            }
          } else {
            return res.status(400).json({ status: false, content: "Access denied!" }).end()
          }
        }
        break;

      default:
        if (req?._parsedUrl?.pathname) {
          if (req._parsedUrl.pathname.includes("login") || req._parsedUrl.pathname.includes("register") || req._parsedUrl.pathname.includes("status")) {
            return next();
          } else {
            res.status(400).json({ status: false, content: "Login or Register first!" }).end();
          }
        } else {
          return next()
        }
        break;
    }
  } else {
    next()
  }
};

async function createLog(req) {
  const methods = req?.route?.methods ? Object.getOwnPropertyNames(req?.route?.methods)[0].toLowerCase() : req?.method.toLowerCase();
  await doc.loadInfo();
  const log = doc.sheetsByTitle["log"];
  const rows = await sheets(log);
  switch (methods) {
    case "post":
      await rows.push("LOG-" + getId("1234567890", 8), {
        uid: req?.session?.uid,
        method: methods,
        col_id: req?.params?.id,
        col_name: req?.params?.col,
      });
      break;
    case "put":
      await rows.push("LOG-" + getId("1234567890", 8), {
        uid: req?.session?.uid,
        method: methods,
        col_id: req?.params?.id,
        col_name: req?.params?.col,
      });
      break;
    case "delete":
      await rows.push("LOG-" + getId("1234567890", 8), {
        uid: req?.session?.uid,
        method: methods,
        col_id: req?.params?.id,
        col_name: req?.params?.col,
      });
      break;
    case "get":
      await rows.push("LOG-" + getId("1234567890", 8), {
        uid: req?.session?.uid,
        method: methods,
        col_id: req?.params?.id,
        col_name: req?.params?.col,
      });
      break;
  }
}
