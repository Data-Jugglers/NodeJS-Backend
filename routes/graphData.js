const router = require("express").Router();
const graphDataV1 = require("../models/v1_data_model");
const graphDataV2 = require("../models/v2_data_models");

// GET methods to retrieve data for each visualization
// Returns Array that contains arrays of objects.
// Response[0] = first dataset (GMonthly)  |  [1] = NM  |  [5] = SY  |  [6] = Links + Description
router.get("/v1", async (req, res, next) => {
  try {
    res.status(200).json(await graphDataV1.getV1Data());
  } catch (error) {
    next(error);
  }
});
// Returns Array containing arrays of objects
// [0] = graph data (year + data)  |  [1] = Links + Description
router.get("/v2", async (req, res, next) => {
  try {
    res.status(200).json(await graphDataV2.getV2Data());
  } catch (error) {
    next(error);
  }
});

// POST methods to insert datasets into the database
// 6 datasets = 6 set_ids [1-6]
// 1=Global m, 2=Northern m, 3=Southern m, ..., 6=Southern y
router.post("/v1", async (req, res, next) => {
  try {
    res.status(200).json(await graphDataV1.setV1());
  } catch (error) {
    next(error);
  }
});
// 1 dataset = 1 set_id [7]
// 7=Northern Hemisphere past 2000 years
router.post("/v2", async (req, res, next) => {
  try {
    res.status(200).json(await graphDataV2.setV2());
  } catch (error) {
    next(error);
  }
});

module.exports = router;
