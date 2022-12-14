const router = require("express").Router();
const graphDataV1 = require("../models/v1_data_model");
const graphDataV3 = require("../models/v3_data_model");
const graphDataV2 = require("../models/v2_data_model");
const graphDataV4 = require("../models/v4_data_model");
const graphDataV5 = require("../models/v5_data_model");

const graphDataV6 = require("../models/v6_data_model");

const graphDataV7 = require("../models/v7_data_model");
const graphDataV8 = require("../models/v8_data_model");
const graphDataV9 = require("../models/v9_data_model");
const graphDataV10 = require("../models/v10_data_model");
const viewModel = require("../models/view_model");
const auth = require("../models/auth");
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
// v5
router.get("/v5", async (req, res, next) => {
  try {
    res.status(200).json(await graphDataV5.getV5Data());
  } catch (error) {
    next(error);
  }
});
//v7
router.get("/v7", async (req, res, next) => {
  try {
    res.status(200).json(await graphDataV7.getV7Data());
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

router.get("/v6", async (req, res, next) => {
  try {
    res.status(200).json(await graphDataV6.getV6Data(req.params.id));
  } catch (error) {
    next(error);
  }
});

router.get("/v4", async (req, res, next) => {
  try {
    res.status(200).json(await graphDataV4.getV4Data(req.params.id));
  } catch (error) {
    next(error);
  }
});
// v8
router.get("/v8", async (req, res, next) => {
  try {
    res.status(200).json(await graphDataV8.getV8Data());
  } catch (error) {
    next(error);
  }
});

router.get("/v9", async (req, res, next) => {
  try {
    res.status(200).json(await graphDataV9.getV9Data(req.params.id));
  } catch (error) {
    next(error);
  }
});
// v10
router.get("/v10", async (req, res, next) => {
  try {
    res.status(200).json(await graphDataV10.getV10Data());
  } catch (error) {
    next(error);
  }
});

// POST method to insert all datasets required for V1 into the database
// 6 datasets = 6 set_ids
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
// v3
router.post("/v3", async (req, res, next) => {
  try {
    res.status(200).json(await graphDataV3.setV3());
  } catch (error) {
    next(error);
  }
});
// v5
router.post("/v5", async (req, res, next) => {
  try {
    res.status(200).json(await graphDataV5.setV5());
  } catch (error) {
    next(error);
  }
});
router.post("/v7", async (req, res, next) => {
  try {
    res.status(200).json(await graphDataV7.setV7());
  } catch (error) {
    next(error);
  }
});

router.post("/v6", async (req, res, next) => {
  try {
    res.status(200).json(await graphDataV6.setV6());
  } catch (error) {
    next(error);
  }
});

router.post("/v4", async (req, res, next) => {
  try {
    res.status(200).json(await graphDataV4.setV4());
  } catch (error) {
    next(error);
  }
});
// v8
router.post("/v8", async (req, res, next) => {
  try {
    res.status(200).json(await graphDataV8.setV8());
  } catch (error) {
    next(error);
  }
});

router.post("/v9", async (req, res, next) => {
  try {
    res.status(200).json(await graphDataV9.setV9());
  } catch (error) {
    next(error);
  }
});
// v10
router.post("/v10", async (req, res, next) => {
  try {
    res.status(200).json(await graphDataV10.setV10());
  } catch (error) {
    next(error);
  }
});

router.post("/view/:id", auth.authentificateToken, async (req, res, next) => {
  try {
    res.status(200).json(await viewModel.addView(req.body, req.params.id));
  } catch (error) {
    next(error);
  }
});

router.get("/view", async (req, res, next) => {
  try {
    res.status(200).json(await viewModel.getViews());
  } catch (error) {
    next(error);
  }
});

router.get("/view/:id", async (req, res, next) => {
  try {
    res.status(200).json(await viewModel.getCreatedView(req.params.id));
  } catch (error) {
    next(error);
  }
});

router.delete("/view/:id", auth.authentificateToken, async (req, res, next) => {
  try {
    res.status(200).json(await viewModel.deleteView(req.params.id));
  } catch (error) {
    next(error);
  }
});
router.delete("/user", auth.authentificateToken, async (req, res, next) => {
  try {
    res.status(200).send(await auth.deleteUser(req, res));
  } catch (error) {
    next(error);
  }
});
router.post("/login", async (req, res, next) => {
  try {
    res.status(200).send(await auth.login(req, res));
  } catch (error) {
    next(error);
  }
});
router.post("/signup", async (req, res) => {
  try {
    res.status(200).send(await auth.signup(req, res));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
