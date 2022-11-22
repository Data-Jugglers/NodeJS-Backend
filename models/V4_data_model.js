const db = require("../config/db");
const helper = require("../config/helper");

const V2Data = require("../files_output/V4/V4.json");
const V2Desc = require("../files_output/V4/V4Desc.json");
const SET_ID = 10;

const getV4Data = async () => {
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

const setV4Components = async () => {
  await db.query(
    "insert into description (set_id, source_link, description_link, description) values($1,$2,$3,$4)",
    [
      SET_ID,
      V4Desc.description.srcLink,
      V4Desc.description.desLink,
      V4Desc.description.des,
    ]
  );
  for (let i = 0; i < V4Data.data.length; i++) {
    const element = V4Data.data[i];
    await db.query(
      "insert into datasets (set_id, measurement_date, data) values ($1,$2,$3)",
      [SET_ID, element.Year, element.T]
    );
  }
};

const setV4 = async () => {
  const check = await db.query("select * from datasets where set_id=$1", [
    SET_ID,
  ]);
  if (check.rows[0]) return "V4 is already set";
  return setV4Components();
};

module.exports = { setV4, getV4Data };
