import requests
import csv
import json


def download_csv_to_json(URL, fileName, firstLine):
    data = {}
    with requests.Session() as s:
        download = s.get(URL)

        decoded_content = download.content.decode('ascii')

        cr = csv.reader(decoded_content.splitlines()
                        [firstLine::], delimiter=',')
        my_list = list(cr)
        keys = my_list[0]
        print(keys)
        data_list = []
        for row in my_list[1::]:
            JSONStr = {}
            if (keys[0] == "year" and keys[1] == "month"):
                if (int(row[1]) < 10):
                    JSONStr["Time"] = row[0]+"-0"+row[1]
                else:
                    JSONStr["Time"] = row[0]+"-"+row[1]
            else:
                JSONStr["Time"] = row[0]
                JSONStr[keys[1]] = row[1]
            for i in range(2, len(row)):

                JSONStr[keys[i]] = row[i]

            data_list.append(JSONStr)

            print(JSONStr)
        data["data"] = data_list

    # with open("v1.csv",encoding='utf-8') as csvf:
        # csvReader=csv.DictReader(csvf)
        # print(csvf)
        # for rows in csvReader:
        # key=rows['Time']
        # data[key]=rows

    file = open(fileName, 'a+')
    with open(fileName, 'w', encoding='utf-8') as jsonf:
        jsonf.write(json.dumps(data, indent=4))


download_csv_to_json(
    "https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_mm_mlo.csv", "files_output/V3/V3m.json", 52)
download_csv_to_json(
    "https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_annmean_mlo.csv", "files_output/V3/V3y.json", 55)
