
import requests
import csv
import json
import re

URL = "https://cdiac.ess-dive.lbl.gov/ftp/trends/co2/lawdome.combined.dat"
data = {}


def text_to_json(data_start, data_end, keys_start, keys_end, name):

    with requests.Session() as s:
        download = s.get(URL)
        global data
        jsonData = {}
        decoded_content = download.content.decode('us-ascii')
        cr = csv.reader(decoded_content.splitlines(), delimiter="\n")
        my_list = list(cr)
        json_list = []
        keyList = re.split(
            r'\s{2,}', (my_list[keys_start][0]).lstrip().rstrip())
        # print(keyList)
        for i in range(keys_start+1, keys_end):

            k = 0
            # print(re.split(r'\s{2,}', (my_list[i][0]).lstrip().rstrip()))
            for keyRow in re.split(r'\s{2,}', (my_list[i][0]).lstrip().rstrip()):
                keyList[k] += " "+keyRow
                #print(keyRow, k)
                k += 1
        for i in range(data_start, data_end):

            jsonData = {}
            k = 0
            for dataRow in re.split(r'\s{2,}', (my_list[i][0]).lstrip().rstrip()):
                key = keyList[k]
                match key:
                    case "Mean Air Age, year A.D.":
                        key = "Time"
                    case "CO2, 20 Year Smoothed, ppm":
                        key = "co2"
                    case "CO2, 75 Year Smoothed, ppm":
                        key = "co2"

                jsonData[key] = dataRow
                k += 1

            json_list.append(jsonData)

        # print(jsonData)
        data[name] = (json_list)

    # with open("v1.csv",encoding='utf-8') as csvf:
    # csvReader=csv.DictReader(csvf)
    # print(csvf)
    # for rows in csvReader:
    # key=rows['Time']
    # data[key]=rows


    #file = open("files_output/V4.json", 'a+')
    # with open("files_output/V4.json", 'w', encoding='utf-8') as jsonf:
    #jsonf.write(json.dumps(data, indent=4))
# text_to_json(22, 54, 18, 20, "first")
# text_to_json(59, 70, 55, 57, "second")
# text_to_json(75, 116, 71, 73, "third")
text_to_json(121, 268, 117, 119, "first")
text_to_json(273, 467, 269, 271, "second")

file = open("files_output/V4/V4.json", 'a+')
with open("files_output/V4/V4.json", 'w', encoding='utf-8') as jsonf:
    jsonf.write(json.dumps(data, indent=4))
