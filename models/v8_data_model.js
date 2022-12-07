const db = require("../config/db");
const helper = require("../config/helper");

const V8Data = require("../files_output/V8/V8.json");
const V8Desc = require("../files_output/V8/V8Desc.json");
const SET_ID = [
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
  40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58,
  59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77,
  78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96,
  97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112,
  113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127,
  128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142,
  143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157,
  158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172,
  173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187,
  188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202,
  203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217,
  218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232,
  233, 234, 235, 236, 237, 238, 239,
];
const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bonaire, Saint Eustatius and Saba",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "British Virgin Islands",
  "Brunei Darussalam",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Canada",
  "Cape Verde",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Cook Islands",
  "Costa Rica",
  "C\u00f4te d'Ivoire",
  "Croatia",
  "Cuba",
  "Cura\u00e7ao",
  "Cyprus",
  "Czech Republic",
  "North Korea",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Ethiopia",
  "Faeroe Islands",
  "Micronesia (Federated States of)",
  "Fiji",
  "Finland",
  "France",
  "French Guiana",
  "French Polynesia",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Greenland",
  "Grenada",
  "Guadeloupe",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iraq",
  "Ireland",
  "Iran",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macao",
  "North Macedonia",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Martinique",
  "Mauritania",
  "Mauritius",
  "Mayotte",
  "Mexico",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "Niue",
  "Norway",
  "Occupied Palestinian Territory",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Bolivia",
  "Poland",
  "Portugal",
  "Qatar",
  "Cameroon",
  "South Korea",
  "Moldova",
  "South Sudan",
  "Sudan",
  "R\u00e9union",
  "Romania",
  "Russian Federation",
  "Rwanda",
  "Saint Helena",
  "Saint Lucia",
  "Sint Maarten (Dutch part)",
  "Samoa",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "Spain",
  "Sri Lanka",
  "Saint Kitts and Nevis",
  "Saint Pierre and Miquelon",
  "Saint Vincent and the Grenadines",
  "Suriname",
  "Swaziland",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks and Caicos Islands",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "Tanzania",
  "USA",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela",
  "Viet Nam",
  "Wallis and Futuna Islands",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];
const getV8Data = async () => {
  let allResults = [];
  // for (let i = 0; i < SET_ID.length; i++) {
  // const ID = SET_ID[i];
  const resultRows = (
    await db.query(
      "select * from datasets where set_id between $1 and $2 order by set_id asc ,measurement_date asc",
      [SET_ID[0], SET_ID[SET_ID.length - 1]]
    )
  ).rows;

  let temp = [resultRows[0]];

  for (let i = 1; i < resultRows.length; i++) {
    if (resultRows[i].set_id == resultRows[i - 1].set_id) {
      temp.push(resultRows[i]);
    } else {
      allResults.push(temp);
      temp = [];
      temp.push(resultRows[i]);
      // console.log(element);
    }
  }

  // }
  allResults.push(temp);

  const description = await db.query(
    "select * from description where set_id=$1",
    [SET_ID[0]]
  );
  allResults.push(description.rows);
  allResults.push(COUNTRIES);

  return helper.emptyOrNot(allResults);
};

const setV8Components = async () => {
  for (let i = 0; i < SET_ID.length; i++) {
    const ID = SET_ID[i];
    await db.query(
      "insert into description (set_id, source_link, description_link, description) values($1,$2,$3,$4)",
      [
        ID,
        V8Desc.description.srcLink,
        V8Desc.description.desLink,
        V8Desc.description.des,
      ]
    );
    for (let j = 0; j < V8Data.data.length; j++) {
      const element = V8Data.data[j];
      await db.query(
        "insert into datasets (set_id, measurement_date, data) values ($1,$2,$3)",
        [ID, element.Time, element[COUNTRIES[i]]]
      );
    }
  }
};

const setV8 = async () => {
  const check = await db.query("select * from datasets where set_id=$1", [
    SET_ID[0],
  ]);
  if (check.rows[0]) return "V8 is already set";
  return setV8Components();
};

module.exports = { setV8, getV8Data };
