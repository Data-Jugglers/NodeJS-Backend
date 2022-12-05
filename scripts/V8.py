import pandas
import json
import numpy as np
import requests

url = 'https://data.icos-cp.eu/licence_accept?ids=%5B%22lApekzcmd4DRC34oGXQqOxbJ%22%5D'
r = requests.get(url)

excel_data_df = pandas.read_excel(
    r.content, sheet_name="Territorial Emissions", skiprows=11
).replace(np.nan, 0, regex=True)  # uncomment replace() to replace NaNs with zeroes

# print(excel_data_df)
json_str = excel_data_df.to_dict(
    orient='records')

json_dict = dict()
json_dict["data"] = json_str


def replaceKey(initialKey, wantedKey, data):
    if (initialKey in data.keys()):
        data[wantedKey] = data[initialKey]
        del data[initialKey]


for data_entry in json_dict["data"]:
    replaceKey("Unnamed: 0", "Time", data_entry)

   # uncomment the section below to delete NaN entries

    # NaNKeys = []  # list of keys whose data is NaN
    # for i in data_entry.keys():
    #     if (np.isnan(data_entry[i])):
    #         NaNKeys.append(i)
    # for i in NaNKeys:
    #     del data_entry[i]

with open("files_output/V8/V8.json", 'w', encoding='utf-8') as jsonf:
    # jsonf.write(json_dict)
    json.dump(json_dict, jsonf, indent=4)
