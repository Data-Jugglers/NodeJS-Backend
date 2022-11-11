const router = require("express").Router();
const graphData = require("../models/graphData_model");

// GET method to retrieve data by set_id
// needs set id as int
// Example /1 -> returns Global measurements in months
// Example /2 -> returns Northern measurements in months || unitl /6
router.get("/:id", async (req, res, next) => {
  try {
    res.status(200).json(await graphData.getGraphData(req.params.id));
  } catch (error) {
    next(error);
  }
});

// POST method to insert all datasets required for V1 into the database
// 6 datasets = 6 set_ids
// 1=Global m, 2=Northern m, 3=Southern m, ..., 6=Southern y
router.post("/v1", async (req, res, next) => {
  try {
    res.status(200).json(await graphData.setV1(1));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
