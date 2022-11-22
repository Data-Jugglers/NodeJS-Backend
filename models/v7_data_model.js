const db = require("../config/db");
const helper = require("../config/helper");

const V7Data1 = require("../files_output/V7/V7_1.json");
const V7Data2 = require("../files_output/V7/V7_2.json");
const V7Data3 = require("../files_output/V7/V7_3.json");
const V7Data4 = require("../files_output/V7/V7_4.json");

const V7Desc = require("../files_output/V7/V7Desc.json");
const SET_ID = 17;

const getV7Data = async () => {
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

const setV7Components = async () => {
  await db.query(
    "insert into description (set_id, source_link, description_link, description) values($1,$2,$3,$4)",
    [
      SET_ID,
      V7Desc.description.srcLink,
      V7Desc.description.desLink,
      V7Desc.description.des,
    ]
  );
  for (const element of V7Data1.data) {
    await db.query(
      "insert into datasets (set_id, measurement_date, data) values ($1,$2,$3)",
      [SET_ID, element["Time (kyr BP)"], element["0.975"]]
    );
  }
  //   for (const element of V7Data2.data) {
  //     await db.query(
  //       "insert into datasets (set_id, measurement_date, data) values ($1,$2,$3)",
  //       [
  //         SET_ID + 1,
  //         element["Time (kyr BP)"],
  //         element["Antarctic temperature change (\u00baC)"],
  //       ]
  //     );
  //   }
};

const setV7 = async () => {
  const check = await db.query("select * from datasets where set_id=$1", [
    SET_ID,
  ]);
  if (check.rows[0]) return "V7 is already set";
  return setV7Components();
};

module.exports = { setV7, getV7Data };
