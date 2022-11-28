const db = require("../config/db");
const helper = require("../config/helper");

// importing all the dataset's as JSON
const V3y = require("../files_output/V3/V3y.json");
const V3m = require("../files_output/V3/V3m.json");
const V3Desc = require("../files_output/V3/V3Desc.json");
const SET_ID = [8, 9];

// Gett all Graph data for v1. Array of object arrays.
// index 0 = GlobalMonthly; index 1 = NorthernMonthly; ...; index 6 = SouthernYearly; index 7 = links+description
const getV3Data = async () => {
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
const setV3Components = async () => {
  const dataArray = [V3m, V3y];
  for (let i = 0; i < dataArray.length; i++) {
    const element = dataArray[i];
    await db.query(
      "insert into description (set_id, source_link, description_link, description) values($1,$2,$3,$4)",
      [
        SET_ID[i],
        V3Desc.description.srcLink,
        V3Desc.description.desLink,
        V3Desc.description.des,
      ]
    );
    element.data.map(async (set) => {
      await db.query(
        "insert into datasets (set_id, measurement_date, data) values ($1,$2,$3)",
        [SET_ID[i], set.Time, set.mean]
      );
    });
  }
};

// checks if the data was already inserted based on set_id
// if not, calls the insert function
const setV3 = async () => {
  const check = await db.query(
    "select * from datasets where set_id=$1 order by measurement_date asc",
    [SET_ID[0]]
  );
  if (check.rows[0]) return "Already set";
  return setV3Components();
};

module.exports = { getV3Data, setV3 };
