const db = require("../config/db");
const helper = require("../config/helper");

const addView = async (body, id) => {
  let exists = true;
  let viewID;
  let counter = 0;
  const allViews = await db.query("select view_id from views");
  while (exists) {
    let innerCheck = false;
    const randomID = Math.floor(Math.random() * 9999999) + 1000000;
    for (let i = 0; i < allViews.rows.length; i++) {
      const element = allViews.rows[i];
      if (element.view_id === randomID) {
        innerCheck = true;
        counter++;
      }
    }
    if (!innerCheck) {
      viewID = randomID;
      exists = false;
    }
    if (counter === 10) {
      return "Something went wrong";
    }
  }
  const result = await db.query(
    "insert into views (view_id, viewJson, user_id) values ($1,$2,$3)",
    [viewID, body, id]
  );
};

const deleteView = async (id) => {
  const result = await db.query("delete from views where view_id=$1", [id]);
};

const getViews = async () => {
  const result = await db.query("select * from views");
  return helper.emptyOrNot(result.rows);
};

const getCreatedView = async (id) => {
  const result = await db.query("select viewJson from views where view_id=$1", [
    id,
  ]);
  return helper.emptyOrNot(result.rows);
};

module.exports = { addView, deleteView, getViews, getCreatedView };
