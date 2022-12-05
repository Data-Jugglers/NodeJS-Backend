const db = require("../config/db");
const helper = require("../config/helper");

const V6Data = require("../files_output/V6/V6.json");
const V6Desc = require("../files_output/V6/V6Desc.json");
const SET_ID = 16;

const getV6Data = async () => {
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

const setV6Components = async () => {
  await db.query(
    "insert into description (set_id, source_link, description_link, description) values($1,$2,$3,$4)",
    [
      SET_ID,
      V6Desc.description.srcLink,
      V6Desc.description.desLink,
      V6Desc.description.des,
    ]
  );
  for (let i = 0; i < V6Data.data.length; i++) {
    const element = V6Data.data[i];
    await db.query(
      "insert into datasets (set_id, measurement_date, data) values ($1,$2,$3)",
      [SET_ID, element["gas age"], element["co2,ppm"]]
    );
  }
};

const setV6 = async () => {
  const check = await db.query("select * from datasets where set_id=$1", [
    SET_ID,
  ]);
  if (check.rows[0]) return "V6 is already set";
  return setV6Components();
};

module.exports = { setV6, getV6Data };
