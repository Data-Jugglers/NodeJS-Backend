import pandas
import json
for i in [0, 1, 2, 3]:
    rows = 0
    if (i == 0):
        rows = 1

    excel_data_df = pandas.read_excel(
        'Snyder_Data_Figures-1/Snyder_Data_Figures/Source Data - Figure 1.xlsx', sheet_name=i, skiprows=rows)

    json_str = excel_data_df.to_dict(orient='records')
    json_dict = dict()
    json_dict["data"] = json_str
    # if ("Antarctic temperature change (\u00baC)" in json_dict["data"][0].keys()):
    #     json_dict["data"][0]["AData"] = json_dict["data"][
    #         0]["Antarctic temperature change (\u00baC)"]
    #     del json_dict["data"][0]["Antarctic temperature change (\u00baC)"]
    if (i == 0):
        for data_entry in json_dict["data"]:

            data_entry["Time (kyr BP)"] = "0" * \
                (4-len(str(data_entry["Time (kyr BP)"]))) + \
                str(data_entry["Time (kyr BP)"])

    def replaceKey(initialKey, wantedKey, data):
        if (initialKey in data.keys()):
            data[wantedKey] = data[initialKey]
            del data[initialKey]
    for data_entry in json_dict["data"]:
        replaceKey("Time (kyr BP)", "Time", data_entry)
        replaceKey("Time (yr BP)", "Time", data_entry)
        replaceKey("Antarctic temperature change (\u00baC)",
                   "Data", data_entry)
        replaceKey("Carbon dioxide (ppm)", "Data", data_entry)
        replaceKey("d18O", "Data", data_entry)

    # print('Excel Sheet to JSON:\n', json_str)
    with open("files_output/V7/V7_"+str(i+1)+".json", 'w', encoding='utf-8') as jsonf:
        # jsonf.write(json_dict)
        json.dump(json_dict, jsonf, indent=4)
