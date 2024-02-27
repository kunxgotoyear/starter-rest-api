const { Router } = require("express");
const router = Router();
const { doc } = require("../auth/google");
const { sheets, getDataForPage, getId } = require("../converter/tab");
const { middleWare } = require("../middleware/index");

router.use(middleWare)
// Get All
router.get("/:col", async (req, res) => {
  try {
    const col = req.params.col;
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[col];
    const rows = await sheets(sheet);
    if (rows.status === false) throw rows;
    const read = rows.read();
    const result = await read;
    const pages = parseInt(req.query.page) || 1;
    const totalPages = Math.ceil(result.content.length / 5);
    if (pages < 1 || pages > totalPages) throw { status: false, content: [], message: "Page not found" };
    result.content = await getDataForPage(pages, result);
    result.pagination = {
      page: parseInt(req.query.page) || 1,
      per_page: 5,
      total_pages: totalPages,
      total_items: result.content.length,
    };
    res.status(200).json(result).end();
  } catch (error) {
    error.status = false
    res.status(400).json(error).end();
  }
});

// Get With Id
router.get("/:col/:id", async (req, res) => {
  try {
    const col = req.params.col;
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[col];
    const rows = await sheets(sheet);
    if (rows.status === false) throw rows;
    const read = rows.read(req.params.id);
    const result = await read;
    res.status(200).json(result).end();
  } catch (error) {
    error.status = false
    res.status(400).json(error).end();
  }
});

// POST
router.post("/:col", async (req, res) => {
  try {
    const col = req.params.col;
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[col];
    const rows = await sheets(sheet);
    if (rows.status === false) throw rows;
    const create = req?.query?.push
      ? rows.push(col.toUpperCase() + "-" + getId("1234567890", 8), req.body)
      : rows.create(col.toUpperCase() + "-" + getId("1234567890", 8), req.body);
    const result = await create;
    res.status(200).json(result).end();
  } catch (error) {
    error.status = false
    res.status(400).json(error).end();
  }
});

// UPDATE
router.put("/:col/:id", async (req, res) => {
  try {
    const col = req.params.col;
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[col];
    const rows = await sheets(sheet);
    if (rows.status === false) throw rows;
    const id = req.params.id;
    const update = rows.update(id, req.body);
    const result = await update;
    res.status(200).json(result).end();
  } catch (error) {
    error.status = false
    res.status(400).json(error).end();
  }
});

// DELETE
router.delete("/:col/:id", async (req, res) => {
  try {
    const col = req.params.col;
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[col];
    const rows = await sheets(sheet);
    if (rows.status === false) throw rows;
    const id = req.params.id;
    const del = rows.delete(id, req.body);
    const result = await del;
    res.status(200).json(result).end();
  } catch (error) {
    error.status = false
    res.status(400).json(error).end();
  }
});

module.exports = router;
