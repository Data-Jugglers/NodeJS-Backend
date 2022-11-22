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
    if (i == 0):
        for data_entry in json_dict["data"]:

            data_entry["Time (kyr BP)"] = "0" * \
                (4-len(str(data_entry["Time (kyr BP)"]))) + \
                str(data_entry["Time (kyr BP)"])
    # print('Excel Sheet to JSON:\n', json_str)
    with open("files_output/V7/V7_"+str(i+1)+".json", 'w', encoding='utf-8') as jsonf:
        # jsonf.write(json_dict)
        json.dump(json_dict, jsonf, indent=4)
