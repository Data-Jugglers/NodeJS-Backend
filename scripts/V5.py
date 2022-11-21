
import requests
import csv
import json

URL = "https://cdiac.ess-dive.lbl.gov/ftp/trends/co2/vostok.icecore.co2"
data = {}
with requests.Session() as s:
    download = s.get(URL)

    decoded_content = download.content.decode('iso-8859-1')

    cr = csv.reader(decoded_content.splitlines())
    my_list = list(cr)
    data_list = []
    JSONstr = {}
    for row in my_list[21::]:
        row = row[0].split()
        print(row)

        JSONstr["Depth (m)"] = row[0]
        JSONstr["Age of the ice (yr BP)"] = row[1]
        JSONstr["Mean age of the air (yr BP)"] = row[2]
        JSONstr["CO2 concentraition (ppmv)"] = row[3]
        data_list.append(JSONstr)
        JSONstr = {}
    # print(data_list)
    data["data"] = data_list


# with open("v1.csv",encoding='utf-8') as csvf:
    # csvReader=csv.DictReader(csvf)
    # print(csvf)
    # for rows in csvReader:
    # key=rows['Time']
    # data[key]=rows

file = open("files_output/V5/V5.json", 'a+')
with open("files_output/V5/V5.json", 'w', encoding='utf-8') as jsonf:
    jsonf.write(json.dumps(data, indent=4))
