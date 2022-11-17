const db = require("../config/db");
const helper = require("../config/helper");

// importing all the dataset's as JSON
const V1Gm = require("../files_output/V1/V1Gm.json");
const V1Gy = require("../files_output/V1/V1Gy.json");
const V1Nm = require("../files_output/V1/V1Nm.json");
const V1Ny = require("../files_output/V1/V1Ny.json");
const V1Sm = require("../files_output/V1/V1Sm.json");
const V1Sy = require("../files_output/V1/V1Sy.json");
const SET_ID = [1, 2, 3, 4, 5, 6];
const V1Desc = require("../files_output/V1/V1Desc.json");

// Gett all Graph data for v1. Array of object arrays.
// index 0 = GlobalMonthly; index 1 = NorthernMonthly; ...; index 6 = SouthernYearly; index 7 = links+description
const getV1Data = async () => {
  let allResults = [];
  for (let i = 0; i < SET_ID.length; i++) {
    const result = await db.query(
      "select * from datasets where set_id=$1 order by measurement_date asc",
      [SET_ID[i]]
    );
    allResults.push(result.rows);
  }
  const description = await db.query(
    "select * from description where set_id=$1",
    [SET_ID[0]]
  );
  allResults.push(description.rows);
  return helper.emptyOrNot(allResults);
};

// function that loops through all JSON files for v1 and inputs them to the database
const setV1Components = async () => {
  const dataArray = [V1Gm, V1Nm, V1Sm, V1Gy, V1Ny, V1Sy];
  for (let i = 0; i < dataArray.length; i++) {
    const element = dataArray[i];
    await db.query(
      "insert into description (set_id, source_link, description_link, description) values($1,$2,$3,$4)",
      [
        SET_ID[i],
        V1Desc.description.srcLink,
        V1Desc.description.desLink,
        V1Desc.description.des,
      ]
    );
    element.data.map(async (set) => {
      await db.query(
        "insert into datasets (set_id, measurement_date, data) values ($1,$2,$3)",
        [SET_ID[i], set.Time, set.degC]
      );
    });
  }
};

// checks if the data was already inserted based on set_id
// if not, calls the insert function
const setV1 = async () => {
  const check = await db.query(
    "select * from datasets where set_id=$1 order by measurement_date asc",
    [SET_ID[0]]
  );
  if (check.rows[0]) return "Already set";
  return setV1Components();
};

module.exports = { getV1Data, setV1 };
