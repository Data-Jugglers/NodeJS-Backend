import pandas
import json
import numpy as np
import requests

url = 'https://ourworldindata.org/uploads/2020/09/Global-GHG-Emissions-by-sector-based-on-WRI-2020.xlsx'
r = requests.get(url)
count = 0
for i in ["Sector", "Sub-sector", "Sub-sector (further breakdown)"]:
    count += 1
    excel_data_df = pandas.read_excel(
        r.content, sheet_name=i).replace(np.nan, 0, regex=True)
    # print(excel_data_df)
    json_str = excel_data_df.to_dict(
        orient='records')

    json_dict = dict()
    # print(json_dict)
    if (i == "Sub-sector (further breakdown)"):
        json_dict["Transport"] = json_str[0:5]
        json_dict["Energy in buildings (elec and heat)"] = json_str[5:7]
        json_dict["Energy in industry"] = json_str[7:14]
        json_dict["Energy in Agri & Fishing"] = json_str[14]
        json_dict["Unallocated fuel combustion"] = json_str[15]
        json_dict["Fugitive emissions from energy"] = json_str[16:18]
        json_dict["Cement"] = json_str[18]
        json_dict["Chemical & petrochemical (industrial)"] = json_str[19]
        json_dict["Livestock & Manure"] = json_str[20]
        json_dict["Rice Cultivation"] = json_str[21]
        json_dict["Agricultural Soils"] = json_str[22]
        json_dict["Crop Burning"], json_dict["Forest Land"], json_dict["Cropland"], \
            json_dict["Grassland"], json_dict["Landfills"], json_dict["Wastewater"] = json_str[
                23], json_str[24], json_str[25], json_str[26], json_str[27], json_str[28]
    if (i == "Sub-sector"):
        json_dict["Energy"] = json_str[0:6]
        json_dict["Industrial processes"] = json_str[6:8]
        json_dict["Agriculture, Forestry & Land Use (AFOLU)"] = json_str[8:15]
        json_dict["Waste"] = json_str[15:17]
    if (i == "Sector"):
        json_dict["data"] = json_str
    # if ("Antarctic temperature change (\u00baC)" in json_dict["data"][0].keys()):
    #     json_dict["data"][0]["AData"] = json_dict["data"][
    #         0]["Antarctic temperature change (\u00baC)"]
    #     del json_dict["data"][0]["Antarctic temperature change (\u00baC)"]

    def replaceKey(initialKey, wantedKey, data):
        if (initialKey in data.keys()):
            data[wantedKey] = data[initialKey]
            del data[initialKey]
    # print(json_dict.keys())
    # for x in json_dict.keys():

    #     for data_entry in json_dict[x]:
    #         replaceKey("Unnamed: 0", "Time", data_entry)
    with open("files_output/V9/V9_"+str(count)+".json", 'w', encoding='utf-8') as jsonf:
        # jsonf.write(json_dict)
        json.dump(json_dict, jsonf, indent=4)

# print('Excel Sheet to JSON:\n', json_str)
# with open("files_output/V8/V9.json", 'w', encoding='utf-8') as jsonf:
#     # jsonf.write(json_dict)
#     json.dump(json_dict, jsonf, indent=4)
