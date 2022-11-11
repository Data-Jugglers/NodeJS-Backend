const db = require("../config/db");
const helper = require("../config/helper");

// importing all the dataset's as JSON
const V1Gm = require("../files_output/V1Gm.json");
const V1Gy = require("../files_output/V1Gy.json");
const V1Nm = require("../files_output/V1Nm.json");
const V1Ny = require("../files_output/V1Ny.json");
const V1Sm = require("../files_output/V1Sm.json");
const V1Sy = require("../files_output/V1Sy.json");
const V1Desc = require("../files_output/V1Desc.json");

// get all the graph data by set_id sorted by date
// (1= v1, global, months)
// (2= v1, northern, months)
const getGraphData = async (set_id) => {
  const result = await db.query(
    "selecT * from datasets where set_id=$1 order by measurement_date asc",
    [set_id]
  );
  return helper.emptyOrNot(result.rows);
};

// function that loops through all JSON files for v1 and inputs them to the database
const setV1Components = async (gm, gy, nm, ny, sm, sy) => {
  const dataArray = [gm, nm, sm, gy, ny, sy];
  for (let i = 0; i < dataArray.length; i++) {
    const element = dataArray[i];
    await db.query(
      "insert into description (source_link, description_link, description) values($1,$2,$3)",
      [
        V1Desc.description.srcLink,
        V1Desc.description.desLink,
        V1Desc.description.des,
      ]
    );
    const setId = await db.query(
      "select set_id from description where source_link=$1",
      [V1Desc.description.srcLink]
    );
    element.data.map(async (set) => {
      await db.query(
        "insert into datasets (set_id, measurement_date, data) values ($1,$2,$3)",
        [setId.rows[i].set_id, set.Time, set.degC]
      );
    });
  }
};

// checks if the data was already inserted based on set_id
// if not, calls the insert function
const setV1 = async (set_id) => {
  const check = await db.query(
    "select * from datasets where set_id=$1 order by measurement_date asc",
    [set_id]
  );
  if (check.rows[0]) return "Already set";
  return setV1Components(V1Gm, V1Gy, V1Nm, V1Ny, V1Sm, V1Sy);
};

module.exports = { getGraphData, setV1 };
