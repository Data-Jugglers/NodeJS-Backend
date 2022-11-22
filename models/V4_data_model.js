const db = require("../config/db");
const helper = require("../config/helper");

// importing all the dataset's as JSON
const V4a = require("../files_output/V4/V4a.json");
const V4b = require("../files_output/V4/V4b.json");
const V4c = require("../files_output/V4/V4c.json");
const V4Desc = require("../files_output/V4/V4Desc.json");
const SET_ID = [22, 23, 24];

// Gett all Graph data for v1. Array of object arrays.
// index 0 = GlobalMonthly; index 1 = NorthernMonthly; ...; index 6 = SouthernYearly; index 7 = links+description
const getV4Data = async () => {
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
const setV4Components = async () => {
  const dataArray = [V4a, V4b, V4c];
  for (let i = 0; i < dataArray.length; i++) {
    const element = dataArray[i];
    await db.query(
      "insert into description (set_id, source_link, description_link, description) values($1,$2,$3,$4)",
      [
        SET_ID[i],
        V4Desc.description.srcLink,
        V4Desc.description.desLink,
        V4Desc.description.des,
      ]
    );
    element.data.map(async (set) => {
      await db.query(
        "insert into datasets (set_id, measurement_date, data) values ($1,$2,$3)",
        [SET_ID[i], set.Time, set.chdata]
      );
    });
  }
};

// checks if the data was already inserted based on set_id
// if not, calls the insert function
const setV4 = async () => {
  const check = await db.query(
    "select * from datasets where set_id=$1 order by measurement_date asc",
    [SET_ID[0]]
  );
  if (check.rows[0]) return "Already set";
  return setV4Components();
};

module.exports = { getV4Data, setV4 };
