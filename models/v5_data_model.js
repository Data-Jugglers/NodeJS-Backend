const db = require("../config/db");
const helper = require("../config/helper");

const V5Data = require("../files_output/V5/V5.json");
const V5Desc = require("../files_output/V5/V5Desc.json");
const SET_ID = 12;

const getV5Data = async () => {
  let allResults = [];

  const result = await db.query(
    "select * from datasets where set_id=$1 order by data_id asc",
    [SET_ID]
  );
  allResults.push(result.rows);

  const description = await db.query(
    "select * from description where set_id=$1",
    [SET_ID]
  );
  allResults.push(description.rows);

  return helper.emptyOrNot(allResults);
};

const setV5Components = async () => {
  await db.query(
    "insert into description (set_id, source_link, description_link, description) values($1,$2,$3,$4)",
    [
      SET_ID,
      V5Desc.description.srcLink,
      V5Desc.description.desLink,
      V5Desc.description.des,
    ]
  );
  for (let i = 0; i < V5Data.data.length; i++) {
    const element = V5Data.data[i];
    await db.query(
      "insert into datasets (set_id, measurement_date, data) values ($1,$2,$3)",
      [SET_ID, element.YearBP, element.CO2]
    );
  }
};

const setV5 = async () => {
  const check = await db.query("select * from datasets where set_id=$1", [
    SET_ID,
  ]);
  if (check.rows[0]) return "V5 is already set";
  return setV5Components();
};

module.exports = { setV5, getV5Data };
