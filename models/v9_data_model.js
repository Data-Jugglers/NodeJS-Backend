const db = require("../config/db");
const helper = require("../config/helper");

const V9Data1 = require("../files_output/V9/V9_1.json");
const V9Data2 = require("../files_output/V9/V9_2.json");
const V9Data3 = require("../files_output/V9/V9_3.json");

const V9Desc = require("../files_output/V9/V9Desc.json");
const SET_ID = 240;

const getV9Data = async () => {
  let allResults = [];

  const sector_data_id = await db.query(
    "select data_id from datasets where set_id=$1 AND measurement_date=$2",
    [SET_ID, Object.keys(V9Data2)[0]]
  );
  allResults.push(sector_data_id.rows[0]["data_id"]);
  //   const result = await db.query(
  //     "select * from datasets where set_id=$1 order by data_id asc",
  //     [SET_ID]
  //   );
  //   allResults.push(result.rows);

  //   const description = await db.query(
  //     "select * from description where set_id=$1",
  //     [SET_ID]
  //   );
  //   allResults.push(description.rows);

  return helper.emptyOrNot(allResults);
};

const setV9Components = async () => {
  await db.query(
    "insert into description (set_id, source_link, description_link, description) values($1,$2,$3,$4)",
    [
      SET_ID,
      V9Desc.description.srcLink,
      V9Desc.description.desLink,
      V9Desc.description.des,
    ]
  );
  for (const element of V9Data1.data) {
    await db.query(
      "insert into datasets (set_id, measurement_date, data) values ($1,$2,$3)",
      [
        SET_ID,
        element["Sector"],
        element["Share of global greenhouse gas emissions (%)"],
      ]
    );
  }
  let subSectorsCount = 0; //this is how many subsectors we currently have, will be used to link sub sub categories to sub categories
  for (let i = 0; i < 4; i++) {
    const id = (
      await db.query(
        "select data_id from datasets where set_id=$1 AND measurement_date=$2",
        [SET_ID, Object.keys(V9Data2)[i]]
      )
    ).rows[0].data_id;

    for (const element of V9Data2[Object.keys(V9Data2)[i]]) {
      subSectorsCount = subSectorsCount + 1;
      await db.query(
        "insert into sub_datasets (sector_set_id, category, data) values ($1,$2,$3)",
        [
          id,
          element["Sub-sector"],
          element["Share of global greenhouse gas emissions (%)"],
        ]
      );
      for (const subElement of V9Data3[element["Sub-sector"]]) {
        await db.query(
          "insert into sub_sub_datasets (sub_sector_set_id, category, data) values ($1,$2,$3)",
          [
            subSectorsCount,
            subElement["Sub-sector"],
            subElement["Share of global greenhouse gas emissions (%)"],
          ]
        );
      }
    }
  }
};

const setV9 = async () => {
  const check = await db.query("select * from datasets where set_id=$1", [
    SET_ID,
  ]);
  // const checkyyyyy = (
  //   await db.query(
  //     "select data_id from datasets where set_id=$1 AND measurement_date=$2",
  //     [SET_ID, Object.keys(V9Data2)[0]]
  //   )
  // ).rows[0].data_id;
  // if (check.rows[0]) return checkyyyyy;
  if (check.rows[0]) return "V9 is already set";

  return setV9Components();
};

module.exports = { setV9, getV9Data };
