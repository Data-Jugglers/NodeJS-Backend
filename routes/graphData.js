const router = require("express").Router();
const graphData = require("../models/v1_data_model");
const graphDataV3 = require("../models/v3_data_model");

// GET method to retrieve data by set_id
// Returns Array that contains arrays of objects.
// Response[0] = first dataset (GMonthly)  |  [1] = NM  |  [5] = SY  |  [6] = Links+Description
router.get("/v1", async (req, res, next) => {
  try {
    res.status(200).json(await graphData.getV1Data(req.params.id));
  } catch (error) {
    next(error);
  }
});

router.get("/v3", async (req, res, next) => {
  try {
    res.status(200).json(await graphDataV3.getV3Data(req.params.id));
  } catch (error) {
    next(error);
  }
});

// POST method to insert all datasets required for V1 into the database
// 6 datasets = 6 set_ids
// 1=Global m, 2=Northern m, 3=Southern m, ..., 6=Southern y
router.post("/v1", async (req, res, next) => {
  try {
    res.status(200).json(await graphData.setV1());
  } catch (error) {
    next(error);
  }
});

router.post("/v3", async (req, res, next) => {
  try {
    res.status(200).json(await graphDataV3.setV3());
  } catch (error) {
    next(error);
  }
});

module.exports = router;
