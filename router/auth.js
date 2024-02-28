const {Router} = require("express")
const bcrypt = require("bcrypt")
const {doc} = require("../auth/google")
const {sheets, getId} = require("../converter/tab")
const {middleWare, createSID, createAUTH} = require("../middleware/index")
const saltRounds = 10

const router = Router()

router.use(middleWare)

router.post("/status", async (req, res) => {
  try {
    if (req?.cookies?.auth) throw {status: false, content: "Already logged in!"}
    if (!req?.cookies?.sid) createSID(res)
    return res.status(400).json({status: false, content: "Login or Register first!"}).end()
  } catch (error) {
    error.status = false
    return res.status(400).json(error).end()
  }
})

router.post("/login", async (req, res) => {
  try {
    if (req?.cookies?.auth) throw {status: true, content: "on login Already logged in!"}
    await doc.loadInfo()
    const docUsers = doc.sheetsByTitle["users"]
    const rows = await sheets(docUsers)
    if (rows.status === false) throw rows
    const read = rows.customRead("username", req.body.username)
    const result = await read
    const match = await bcrypt.compare(req.body.password, result.content.password)
    if (!match) throw {status: false, content: "Username and Password not match!"}
    createAUTH(res, await bcrypt.hash(req.cookies.sid, saltRounds), result)
    return res.status(200).json({status: true, content: "You are logged in!", uid: result.content.id}).end()
  } catch (error) {
    return res.status(400).json(error).end()
  }
})

router.post("/register", async (req, res) => {
  try {
    await doc.loadInfo()
    const docUsers = doc.sheetsByTitle["users"]
    const rows = await sheets(docUsers)
    if (rows.status === false) throw rows
    req.body.password = await bcrypt.hash(req.body.password, saltRounds)
    const create = rows.customCreate("username", getId("1234567890qwertyuiopasdfghjklzxcvbnm", 14), req.body)
    const result = await create
    if (!result.status) throw result
    return res.status(200).json(result).end()
  } catch (error) {
    return res.status(400).json(error).end()
  }
})

router.put("/logout", async (req, res) => {
  try {
    if (!req?.cookies?.auth) throw {status: false, content: "Login first!"}
    res.clearCookie("auth")
    res.clearCookie("uid")
    return res.status(200).json({status: true, content: "Successfully logout!"}).end()
  } catch (error) {
    return res.status(400).json(error).end()
  }
})

router.put("/profile/:id", async (req, res) => {
  try {
    if (!req?.cookies?.auth) throw {status: false, content: "Login first!"}
    await doc.loadInfo()
    const docUsers = doc.sheetsByTitle["users"]
    const rows = await sheets(docUsers)
    if (rows.status === false) throw rows
    const read = rows.read(req.params.id)
    const result = await read
    if (result.status === false) throw result
    const match = await bcrypt.compare(req.body.password, result.content.password)
    if (!match) throw {status: false, content: "Username and Password not match!"}
    delete req.body.password
    delete req.body.email
    delete req.body.username
    const update = rows.update(req.params.id, req.body)
    const updated = await update
    if (updated.status === false) throw updated
    return res.status(200).json({status: true, content: "Profile updated!"}).end()
  } catch (error) {
    return res.status(400).json(error).end()
  }
})

router.put("/change_password/:id", async (req, res) => {
  try {
    if (!req?.cookies?.auth) throw {status: false, content: "Login first!"}
    const saltRounds = 10
    await doc.loadInfo()
    const docUsers = doc.sheetsByTitle["users"]
    const rows = await sheets(docUsers)
    if (rows.status === false) throw rows
    const read = rows.read(req.params.id)
    const result = await read
    if (result.status === false) throw result
    const match = await bcrypt.compare(req.body.password, result.content.password)
    if (!match) throw {status: false, content: "Username and Password not match!"}
    delete req.body.password
    delete req.body.email
    delete req.body.username
    req.body.password = await bcrypt.hash(req.body.new_password, saltRounds)
    delete req.body.new_password
    const update = rows.update(req.params.id, req.body)
    const updated = await update
    if (updated.status === false) throw updated
    return res.status(200).json({status: true, content: "New password updated!"}).end()
  } catch (error) {
    return res.status(400).json(error).end()
  }
})

module.exports = router
