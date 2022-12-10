const db = require("../config/db");
const helper = require("../config/helper");

const V10V4Data = require("../files_output/V10/V10v4.json");
const V10V7Data = require("../files_output/V10/V10v7.json");
const V10Desc = require("../files_output/V10/V10Desc.json");
const SET_ID = [241, 242];

const getV10Data = async () => {
  let allResults = [];
  for (let i = 0; i < SET_ID.length; i++) {
    const ID = SET_ID[i];
    const result = await db.query(
      "select * from datasets where set_id=$1 order by measurement_date asc",
      [ID]
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

const setV10Components = async () => {
  for (let i = 0; i < SET_ID.length; i++) {
    const ID = SET_ID[i];
    await db.query(
      "insert into description (set_id, source_link, description_link, description) values($1,$2,$3,$4)",
      [
        ID,
        V10Desc.description.srcLink,
        V10Desc.description.desLink,
        V10Desc.description.des,
      ]
    );

    if (i == 0) {
      for (let j = 0; j < V10V4Data.data.length; j++) {
        const element = V10V4Data.data[j];
        await db.query(
          "insert into datasets (set_id, measurement_date, data, string) values ($1,$2,$3)",
          [ID, element.Time, 0, element.Event]
        );
      }
    } else {
      for (let j = 0; j < V10V7Data.data.length; j++) {
        const element = V10V7Data.data[j];
        await db.query(
          "insert into datasets (set_id, measurement_date, data, string) values ($1,$2,$3)",
          [ID, element.YearsBP, 0, element.Event]
        );
      }
    }
  }
};

const setV10 = async () => {
  const check = await db.query("select * from datasets where set_id=$1", [
    SET_ID[0],
  ]);
  if (check.rows[0]) return "V10 is already set";
  return setV10Components();
};

module.exports = { setV10, getV10Data };
