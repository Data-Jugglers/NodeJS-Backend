const db = require("../config/db");
const helper = require("../config/helper");

const V2Data = require("../files_output/V2/V2.json");
const V2Desc = require("../files_output/V2/V2Desc.json");
const SET_ID = 7;

const getV2Data = async () => {
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

const setV2Components = async () => {
  await db.query(
    "insert into description (set_id, source_link, description_link, description) values($1,$2,$3,$4)",
    [
      SET_ID,
      V2Desc.description.srcLink,
      V2Desc.description.desLink,
      V2Desc.description.des,
    ]
  );
  for (let i = 0; i < V2Data.data.length; i++) {
    const element = V2Data.data[i];
    await db.query(
      "insert into datasets (set_id, measurement_date, data) values ($1,$2,$3)",
      [SET_ID, element.Time, element.T]
    );
  }
};

const setV2 = async () => {
  const check = await db.query("select * from datasets where set_id=$1", [
    SET_ID,
  ]);
  if (check.rows[0]) return "V2 is already set";
  return setV2Components();
};

module.exports = { setV2, getV2Data };
