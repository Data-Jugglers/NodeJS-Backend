import pandas
import json
import numpy as np
import requests

url = 'https://ourworldindata.org/uploads/2020/09/Global-GHG-Emissions-by-sector-based-on-WRI-2020.xlsx'
r = requests.get(url)
count = 0
for i in ["Sub-sector (further breakdown)", "Sub-sector", "Sector"]:
    count += 1
    excel_data_df = pandas.read_excel(
        r.content, sheet_name=i).replace(np.nan, 0, regex=True)
    print(excel_data_df)
    json_str = excel_data_df.to_dict(
        orient='records')

    json_dict = dict()
    json_dict["data"] = json_str
    # if ("Antarctic temperature change (\u00baC)" in json_dict["data"][0].keys()):
    #     json_dict["data"][0]["AData"] = json_dict["data"][
    #         0]["Antarctic temperature change (\u00baC)"]
    #     del json_dict["data"][0]["Antarctic temperature change (\u00baC)"]

    def replaceKey(initialKey, wantedKey, data):
        if (initialKey in data.keys()):
            data[wantedKey] = data[initialKey]
            del data[initialKey]

    for data_entry in json_dict["data"]:
        replaceKey("Unnamed: 0", "Time", data_entry)
    with open("files_output/V9/V9_"+str(count)+".json", 'w', encoding='utf-8') as jsonf:
        # jsonf.write(json_dict)
        json.dump(json_dict, jsonf, indent=4)

# print('Excel Sheet to JSON:\n', json_str)
# with open("files_output/V8/V9.json", 'w', encoding='utf-8') as jsonf:
#     # jsonf.write(json_dict)
#     json.dump(json_dict, jsonf, indent=4)
