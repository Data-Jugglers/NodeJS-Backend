
import requests
import csv
import json

URL = "https://www.ncei.noaa.gov/pub/data/paleo/icecore/antarctica/antarctica2015co2composite.txt"
data = {}
with requests.Session() as s:
    download = s.get(URL)

    decoded_content = download.content.decode('iso-8859-1')

    cr = csv.reader(decoded_content.splitlines())
    my_list = list(cr)
    data_list = []
    JSONstr = {}
    for row in my_list[138:2039]:

        row = row[0].split()
        JSONstr["age gas,calBP"] = row[0]
        JSONstr["co2,ppm"] = row[1]
        JSONstr["co2 1s,ppm"] = row[2]

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

file = open("files_output/V6/V6.json", 'a+')
with open("files_output/V6/V6.json", 'w', encoding='utf-8') as jsonf:
    jsonf.write(json.dumps(data, indent=4))
